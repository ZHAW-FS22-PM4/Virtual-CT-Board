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
  for (const area of code.areas) {
    const type = $enum(SectionType).asValueOrThrow(area.type)
    writer.startSection(type, area.name)
    const pool: ILiteralPool = { entries: [] }
    for (const instruction of area.instructions) {
      writer.mapLine(instruction.line)
      addLabel(writer, instruction)
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
  writer.writeBytes(bytes, 2)
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
    for (const option of instruction.options) {
      writer.addDataRelocation(option, bytes.length)
      writer.writeBytes(bytes, 4)
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
  const values = instruction.options.map((x) => +x)
  switch (instruction.name) {
    case 'DCB':
      bytes = values.map(Byte.fromUnsignedInteger)
      alignment = 1
      break
    case 'DCW':
      bytes = values
        .map(Halfword.fromUnsignedInteger)
        .flatMap((x) => x.toBytes())
      alignment = 2
      break
    case 'DCD':
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
  writer.writeBytes(bytes, alignment)
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
  if (encoder.needsLabels) {
    writer.addCodeRelocation(instruction, bytes.length)
  }
  writer.writeBytes(bytes, 2)
}

/**
 * Writes a literal pool to the file writer.
 *
 * @param writer the file writer
 * @param pool the literal pool to write
 */
function writeLiteralPool(writer: FileWriter, pool: ILiteralPool) {
  if (pool.entries.length > 0) {
    writer.writeBytes(END_OF_CODE.toBytes(), 2)
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
