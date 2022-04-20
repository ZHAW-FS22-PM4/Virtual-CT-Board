import { IELF, SegmentType } from './elf'
import { parse } from './parser'
import { encode } from './encoder'
import { Word } from 'types/binary'
import InstructionSet from 'instruction/set'
import { END_OF_CODE } from 'instruction/special'

// Constant addresses required by the assembler/linker to create an executable file for the CT board.
const FLASH_START = Word.fromUnsignedInteger(0x08000000)
const SRAM_START = Word.fromUnsignedInteger(0x20000000)
const STACK_SIZE = Word.fromUnsignedInteger(0x00002000)

/**
 * Assembles a code file (text representation) into an executable file.
 *
 * @param code the assembler code
 * @returns the generated executable file
 */
export function assemble(code: string): IELF {
  const ast = parse(code)
  const objectFile = encode(ast, InstructionSet)
  return createExecutable(objectFile)
}

function createExecutable(objectFile: IELF): IELF {
  const vectorTable = [
    Word.fromUnsignedInteger(SRAM_START.value + STACK_SIZE.value),
    Word.fromUnsignedInteger(FLASH_START.value + 8)
  ]
  const executable = {
    segments: [
      {
        type: SegmentType.LOAD,
        address: FLASH_START,
        offset: Word.fromUnsignedInteger(0x00),
        size: Word.fromUnsignedInteger(objectFile.content.length + 10)
      }
    ],
    sections: {},
    symbols: {},
    content: [
      ...vectorTable.flatMap((x) => x.toBytes()),
      ...objectFile.content,
      ...END_OF_CODE.toBytes()
    ],
    sourceMap: new Map<number, number>()
  }
  objectFile.sourceMap.forEach((offset, line) => {
    executable.sourceMap.set(FLASH_START.add(offset + 8).value, line)
  })
  return executable
}
