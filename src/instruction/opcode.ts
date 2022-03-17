import { Halfword } from 'types/binary'

/**
 * Matches an opcode (as a halfword) with a bit pattern (as a string).
 *
 * @param opcode the opcode as a halfword
 * @param pattern the pattern as a string
 * @returns 'true' in case the opcode matches the pattern, otherwise 'false'
 */
export function match (opcode: Halfword, pattern: string): boolean {
  if (pattern.length !== 16) {
    throw new Error('Opcode pattern length is invalid. Must be 16 characters long.')
  }
  for (let i = 0; i < 16; i++) {
    const character = pattern[i]
    if (!['0', '1', 'X'].includes(character)) {
      throw new Error('Opcode pattern contains invalid characters. Only 1, 0 or X are valid pattern characters.')
    }
    const mask = 1 << (15 - i)
    const isBitSet = (opcode.value & mask) === 0
    if (isBitSet && character === '0') {
      return false
    }
    if (!isBitSet && character === '1') {
      return false
    }
  }
  return true
}
