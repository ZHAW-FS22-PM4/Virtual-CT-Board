import { Halfword } from 'types/binary'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'

/**
 * Matches an opcode (as a halfword) with a bit pattern (as a string).
 *
 * @param opcode the opcode as a halfword
 * @param pattern the pattern as a string
 * @returns 'true' in case the opcode matches the pattern, otherwise 'false'
 */
export function match(opcode: Halfword, pattern: string): boolean {
  if (pattern.length !== 16) {
    throw new VirtualBoardError(
      'Opcode pattern length is invalid. Must be 16 characters long.',
      VirtualBoardErrorType.InvalidParamProvided
    )
  }
  for (let i = 0; i < 16; i++) {
    const character = pattern[i]
    if (!['0', '1', 'X'].includes(character)) {
      throw new VirtualBoardError(
        'Opcode pattern contains invalid characters. Only 1, 0 or X are valid pattern characters.',
        VirtualBoardErrorType.InvalidParamProvided
      )
    }
    const mask = 1 << (15 - i)
    const isBitSet = (opcode.value & mask) !== 0
    if (isBitSet && character === '0') {
      return false
    }
    if (!isBitSet && character === '1') {
      return false
    }
  }
  return true
}

/**
 * Creates an opcode from a given pattern
 *
 * @param pattern opcode pattern of the instruction (has to be 16 bits digits long)
 * @returns halfword with the created opcode
 */
export function create(pattern: string): Halfword {
  if (pattern.length !== 16) {
    throw new VirtualBoardError(
      'Opcode pattern length is invalid. Must be 16 characters long.',
      VirtualBoardErrorType.InvalidParamProvided
    )
  }
  let opcode: number = 0
  for (let i = 0; i < 16; i++) {
    const character = pattern[i]
    if (!['0', '1', 'X'].includes(character)) {
      throw new VirtualBoardError(
        'Opcode pattern contains invalid characters. Only 1, 0 or X are valid pattern characters.',
        VirtualBoardErrorType.InvalidParamProvided
      )
    }
    if (character === '1') {
      const mask = 1 << (15 - i)
      opcode |= mask
    }
  }
  return Halfword.fromUnsignedInteger(opcode)
}

/**
 * Sets the bits of an opcode given in a pattern according to the given value
 * Zeros are not set, only ones!
 * e.g.: opcode: 0011010001110001 pattern: 0001110011000XXX, value 110
 *  -> opcode 0011010001110111
 *
 * @param opcode opcode to change
 * @param pattern defines which bits have to be set (has to be 16 bits digits long)
 * @param value value to be set at the defined bits
 * @returns given opcode with the bits set (defined by pattern and value)
 */
export function setBits(
  opcode: Halfword,
  pattern: string,
  value: Halfword
): Halfword {
  if (pattern.length !== 16) {
    throw new VirtualBoardError(
      'Opcode pattern length is invalid. Must be 16 characters long.',
      VirtualBoardErrorType.InvalidParamProvided
    )
  }
  let opcodeNr: number = opcode.value
  let bitsToChange: number = (pattern.match(/X/g) || []).length
  if (bitsToChange === 0) {
    return opcode
  }
  let valueString: string = value.toBinaryString().slice(16 - bitsToChange)
  let k = 0
  for (let i = 0; i < 16; i++) {
    const character = pattern[i]
    if (!['0', '1', 'X'].includes(character)) {
      throw new VirtualBoardError(
        'Opcode pattern contains invalid characters. Only 1, 0 or X are valid pattern characters.',
        VirtualBoardErrorType.InvalidParamProvided
      )
    }

    if (character === 'X') {
      if (valueString[k] === '1') {
        const mask = 1 << (15 - i)
        opcodeNr |= mask
      }
      k++
    }
  }
  return Halfword.fromUnsignedInteger(opcodeNr)
}

/**
 * Gets defined bits of an opcode
 *
 * @param opcode opcode to get the bits from
 * @param pattern defines which bits are returned (has to be 16 bits digits long)
 * @returns the chosen bits as halfword
 */
export function getBits(opcode: Halfword, pattern: string): Halfword {
  if (pattern.length !== 16) {
    throw new VirtualBoardError(
      'Opcode pattern length is invalid. Must be 16 characters long.',
      VirtualBoardErrorType.InvalidParamProvided
    )
  }
  let valueString: string = ''
  for (let i = 0; i < 16; i++) {
    const character = pattern[i]
    if (!['0', '1', 'X'].includes(character)) {
      throw new VirtualBoardError(
        'Opcode pattern contains invalid characters. Only 1, 0 or X are valid pattern characters.',
        VirtualBoardErrorType.InvalidParamProvided
      )
    }
    if (character === 'X') {
      const mask = 1 << (15 - i)
      if ((opcode.value & mask) !== 0) {
        valueString = valueString.concat('1')
      } else {
        valueString = valueString.concat('0')
      }
    }
  }
  if (valueString === '') {
    valueString = '0'
  }
  return Halfword.fromUnsignedInteger(parseInt(valueString, 2))
}
