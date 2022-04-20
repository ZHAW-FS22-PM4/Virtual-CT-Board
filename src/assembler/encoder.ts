import { IInstructionSet } from 'instruction/interfaces'
import { Byte, Halfword, Word } from 'types/binary'
import { ICodeFile, IInstruction } from './ast'
import { IELF } from './elf'

/**
 * Encodes a code file (AST representation) into an object file.
 *
 * @param code the code file (AST representation)
 * @returns the object file representation
 */
export function encode(code: ICodeFile, instructionSet: IInstructionSet): IELF {
  const elf: IELF = {
    segments: [],
    sections: {},
    symbols: {},
    content: [],
    sourceMap: new Map<number, number>()
  }
  for (let area of code.areas) {
    const section = (elf.sections[area.name] = {
      offset: Word.fromUnsignedInteger(elf.content.length),
      size: Word.fromUnsignedInteger(0)
    })
    for (let instruction of area.instructions) {
      elf.sourceMap.set(
        section.offset.add(elf.content.length).value,
        instruction.line
      )
      elf.content.push(...encodeInstruction(instruction, instructionSet))
    }
    section.size = Word.fromUnsignedInteger(
      elf.content.length - section.offset.value
    )
  }
  return elf
}

function encodeInstruction(
  instruction: IInstruction,
  instructionSet: IInstructionSet
): Byte[] {
  let bytes = encodeDataInsruction(instruction)
  if (bytes.length == 0) {
    bytes = encodeCodeInstruction(instruction, instructionSet)
  }
  return bytes
}

function encodeCodeInstruction(
  instruction: IInstruction,
  instructionSet: IInstructionSet
): Byte[] {
  return instructionSet
    .getEncoder(instruction.name, instruction.options)
    .encodeInstruction(instruction.options, {})
    .toBytes()
}

function encodeDataInsruction(instruction: IInstruction): Byte[] {
  const expressions = instruction.options.map(Number)
  switch (instruction.name) {
    case 'DCB':
      return expressions.map(Byte.fromUnsignedInteger)
    case 'DCW':
      return expressions
        .map(Halfword.fromUnsignedInteger)
        .flatMap((x) => x.toBytes())
    case 'DCD':
      return expressions
        .map(Word.fromUnsignedInteger)
        .flatMap((x) => x.toBytes())
    case 'SPACE':
    case 'FILL':
    case '%':
      return Array(expressions[0]).fill(Byte.fromUnsignedInteger(0x00))
  }
  return []
}
