import { AssemblerError } from 'assembler/error'
import { InstructionError } from 'instruction/error'
import InstructionSet from 'instruction/set'
import { END_OF_CODE } from 'instruction/special'
import { $enum } from 'ts-enum-util'
import { Byte, Halfword, Word } from 'types/binary'
import { ICodeFile, IInstruction, ISymbols } from './ast'
import { IELF, SectionType, SymbolType } from './elf/interfaces'
import { createFile } from './elf/utils'
import { FileWriter } from './elf/writer'

/**
 * Represents a literal pool which can be filled with data and can be
 * used to generate LDR instructions.
 */
interface ILiteralPool {
  entries: Array<{
    /**
     * The instruction which is used for accessing the literal.
     */
    instruction: IInstruction

    /**
     * The offset in the section where this literal is accessed from.
     */
    offset: number

    /**
     * The length of the instruction (in bytes) which is used to access the literal.
     */
    length: number

    /**
     * The value of the literal (either defined via a symbol or with a immediate).
     */
    value: string
  }>
}

/**
 * Encodes a code file (AST representation) into a linkable object file (ELF format).
 *
 * The returned object file is in the following format:
 * - segments: empty (not executable)
 * - sections: in same order as in the source file
 * - symbols: contains all defined symbols from the source file
 *   - literal symbols have their final word value
 *   - address symbols have an relative address from the beginning of the section
 * - relocations: contains all parts of the object file which need to be updated
 *   - for each instruction there is a CODE relocation entry
 *   - for each symbol in a literal pool there is a DATA relocation entry
 * - sourceMap: contains only source line mappings
 * - content: contains the code and data of the object file
 *   - instructions are encoded without any label offset information
 *   - pseudo instructions are expanded and literal pools have been created
 *
 * @param code the code file (AST representation)
 * @returns a linkable object file (ELF format)
 */
export function encode(code: ICodeFile): IELF {
  const file = createFile()
  const writer = new FileWriter(file)
  addSymbols(writer, code.symbols)
  const equConstants: Map<string, Word> = createEquConstantsMap(file)
  for (const area of code.areas) {
    const type = $enum(SectionType).asValueOrThrow(area.type)
    writer.startSection(type, area.name)
    const pool: ILiteralPool = { entries: [] }
    for (const instruction of area.instructions) {
      writer.mapLine(instruction.line)
      addLabel(writer, instruction)
      replaceEquConstants(instruction, equConstants)
      try {
        writeInstruction(writer, instruction, pool)
      } catch (e: any) {
        if (e instanceof InstructionError) {
          throw new AssemblerError(e.message, instruction.line)
        } else if (e instanceof Error) {
          throw e // in case of everything else just throw it on
        }
      }
    }
    writeLiteralPool(writer, pool)
    writer.endSection()
  }
  return file
}

/**
 * Creates a map for fast lookup of equ constants.
 *
 * @param file file from which the map is created
 * @returns created map
 */
function createEquConstantsMap(file: IELF): Map<string, Word> {
  const equConstants: Map<string, Word> = new Map<string, Word>()
  for (const symbol in file.symbols) {
    if (file.symbols[symbol].type === SymbolType.Constant)
      equConstants.set(file.symbols[symbol].name, file.symbols[symbol].value)
  }
  return equConstants
}

/**
 * Replaces all references to equ constants for the given instruction with the actual value.
 *
 * @param instruction instruction to replace options
 * @param equConstants map of equ constant that is used to lookup the actual value
 */
function replaceEquConstants(
  instruction: IInstruction,
  equConstants: Map<string, Word>
): void {
  for (let i = 0; i < instruction.options.length; i++) {
    const hasEndingBracket = instruction.options[i].endsWith(']')
    let trimmedEquName = hasEndingBracket
      ? instruction.options[i]
          .slice(1, instruction.options[i].length - 1)
          .trim()
      : instruction.options[i].slice(1).trim()
    if (instruction.options[i].startsWith('#') && isNaN(+trimmedEquName)) {
      const val = equConstants.get(trimmedEquName)

      if (val && !hasEndingBracket) {
        instruction.options[i] = '#' + val.toUnsignedInteger().toString()
      } else if (val && hasEndingBracket) {
        instruction.options[i] = '#' + val.toUnsignedInteger().toString() + ']'
      } else {
        throw new AssemblerError(
          `Instruction refers to constant #${trimmedEquName} which does not exists.`,
          instruction.line
        )
      }
    }
  }
}

/**
 * Adds the specified symbols to the file.
 *
 * @param writer the file writer
 * @param symbols the symbols to be added
 */
function addSymbols(writer: FileWriter, symbols: ISymbols): void {
  for (const name in symbols) {
    writer.addSymbol({
      type: SymbolType.Constant,
      name: name,
      value: Word.fromUnsignedInteger(+symbols[name])
    })
  }
}

/**
 * Adds the label of the specified instruction (if any) to
 * the file.
 *
 * @param writer the file writer
 * @param instruction the instruction
 */
function addLabel(writer: FileWriter, instruction: IInstruction): void {
  if (instruction.label) {
    try {
      writer.addSymbol({
        type: SymbolType.Address,
        name: instruction.label,
        section: writer.getCurrentSection().name,
        value: Word.fromUnsignedInteger(writer.getCurrentSectionOffset())
      })
    } catch (e: any) {
      if (e instanceof Error) {
        throw new AssemblerError(e.message, instruction.line)
      }
    }
  }
}

/**
 * Writes the specified instruction to the file.
 *
 * @param writer the file writer
 * @param instruction the instruction
 * @param pool the literal pool to be used for pseudo instructions
 */
function writeInstruction(
  writer: FileWriter,
  instruction: IInstruction,
  pool: ILiteralPool
) {
  if (isPseudoInstruction(instruction))
    writePseudoInstruction(writer, instruction, pool)
  else if (isDataInstruction(instruction))
    writeDataInstruction(writer, instruction)
  else writeCodeInstruction(writer, instruction)
}

/**
 * Determines whether the specified instruction is a
 * pseudo instruction.
 *
 * @param instruction the instruction to check
 * @returns whether the instruction is a pseudo instruction
 */
function isPseudoInstruction(instruction: IInstruction): boolean {
  return (
    instruction.name === 'LDR' &&
    instruction.options.length === 2 &&
    instruction.options[1].startsWith('=')
  )
}

/**
 * Writes a pseudo instruction to the specified file writer.
 *
 * @param writer the file writer
 * @param instruction the pseudo instruction
 * @param pool the literal pool to be used
 */
function writePseudoInstruction(
  writer: FileWriter,
  instruction: IInstruction,
  pool: ILiteralPool
): void {
  const options = [instruction.options[0], 'literal']
  const encoder = InstructionSet.getEncoder(instruction.name, options)
  const opcode = encoder.encodeInstruction(options)
  const bytes = opcode.flatMap((x) => x.toBytes())
  writer.align(2)
  pool.entries.push({
    instruction: {
      name: instruction.name,
      options,
      line: instruction.line
    },
    offset: writer.getCurrentSectionOffset(),
    length: bytes.length,
    value: instruction.options[1].slice(1)
  })
  writer.writeBytes(bytes)
}

/**
 * Determines whether the specified instruction is a data instruction.
 *
 * @param instruction the instruction to check
 * @returns whether the instruction is a data instruction
 */
function isDataInstruction(instruction: IInstruction): boolean {
  return ['DCB', 'DCW', 'DCD', 'SPACE', 'FILL', '%', 'ALIGN'].includes(
    instruction.name
  )
}

/**
 * Determines whether the specified instruction is a data instruction which is
 * defined using a symbol.
 *
 * @param instruction the instruction to check
 * @returns whether the instruction is using a symbol
 */
function isSymbolDataInstruction(instruction: IInstruction): boolean {
  return (
    instruction.name == 'DCD' &&
    instruction.options.every((option) => isNaN(+option))
  )
}

/**
 * Writes a data instruction to the file writer.
 *
 * @param writer the file writer
 * @param instruction the data instruction to write
 */
function writeDataInstruction(
  writer: FileWriter,
  instruction: IInstruction
): void {
  if (isSymbolDataInstruction(instruction)) {
    const bytes = Word.fromUnsignedInteger(0x0).toBytes()
    writer.align(4)
    for (const option of instruction.options) {
      writer.addDataRelocation(option.trim(), bytes.length)
      writer.writeBytes(bytes)
    }
    return
  } else if (instruction.name === 'ALIGN') {
    const alignment =
      instruction.options.length > 0 ? Number(instruction.options[0]) : 4
    writer.align(alignment)
    return
  }
  let bytes: Byte[] = []
  let alignment: number = 0
  let optionsContainAString: boolean = false
  let values: number[] = []
  instruction.options.forEach((x) => {
    if (x.startsWith('"')) {
      optionsContainAString = true
      x = x.substring(1, x.length - 1)
      for (let i = 0; i < x.length; i++) {
        if (i + 1 < x.length) {
          // Special case when the string contains an escaped double quote (i.e. "Example'"")
          if (x.charAt(i) === `'` && x.charAt(i + 1) === `"`) {
            continue
          }
        }
        values.push(x.charCodeAt(i))
      }
    } else {
      values.push(+x)
    }
  })
  switch (instruction.name) {
    case 'DCB':
      bytes = values.map(Byte.fromUnsignedInteger)
      alignment = 1
      break
    case 'DCW':
      if (optionsContainAString) {
        throw new AssemblerError(
          'String operands can only be specified for DCB',
          instruction.line
        )
      }
      bytes = values
        .map(Halfword.fromUnsignedInteger)
        .flatMap((x) => x.toBytes())
      alignment = 2
      break
    case 'DCD':
      if (optionsContainAString) {
        throw new AssemblerError(
          'String operands can only be specified for DCB',
          instruction.line
        )
      }
      bytes = values.map(Word.fromUnsignedInteger).flatMap((x) => x.toBytes())
      alignment = 4
      break
    case 'SPACE':
    case 'FILL':
    case '%':
      bytes = Array(values[0]).fill(Byte.fromUnsignedInteger(0x00))
      alignment = 1
      break
  }
  writer.align(alignment)
  writer.writeBytes(bytes)
}

/**
 * Writes a code instruction to the specified file writer.
 *
 * @param writer the file writer
 * @param instruction the code instruction to write
 */
function writeCodeInstruction(
  writer: FileWriter,
  instruction: IInstruction
): void {
  const encoder = InstructionSet.getEncoder(
    instruction.name,
    instruction.options
  )
  const opcode = encoder.encodeInstruction(instruction.options)
  const bytes = opcode.flatMap((x) => x.toBytes())
  writer.align(2)
  if (encoder.needsLabels) {
    writer.addCodeRelocation(instruction, bytes.length)
  }
  writer.writeBytes(bytes)
}

/**
 * Writes a literal pool to the file writer.
 *
 * @param writer the file writer
 * @param pool the literal pool to write
 */
function writeLiteralPool(writer: FileWriter, pool: ILiteralPool) {
  if (pool.entries.length > 0) {
    // To ensure that it's not possible for the processor to 'fall into'
    // the literal pool, we add a 'END_OF_CODE' instruction before the literal pool.
    writer.align(2)
    writer.writeBytes(END_OF_CODE.toBytes())
    // Because the offset to the 'DCD' instruction is calculated before the data instruction
    // is written and we want the offset to include the alignment, we word align everything
    // before writing the literal pool.
    writer.align(4)
    for (const entry of pool.entries) {
      const encoder = InstructionSet.getEncoder(
        entry.instruction.name,
        entry.instruction.options
      )
      const vpc = entry.offset + entry.length
      const opcode = encoder.encodeInstruction(entry.instruction.options, {
        literal: Word.fromSignedInteger(writer.getCurrentSectionOffset() - vpc)
      })
      writer.setBytes(
        entry.offset,
        opcode.flatMap((x) => x.toBytes())
      )
      writeDataInstruction(writer, {
        name: 'DCD',
        options: [entry.value],
        line: entry.instruction.line
      })
    }
  }
}
