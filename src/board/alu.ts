import { Word } from 'types/binary'

export type AluResult = {
  result: Word
  N: boolean
  Z: boolean
  C: boolean
  V: boolean
}

/**
 * Adds the two words together and returns the result with the correclty set flags.
 *
 * @param o1 operant one
 * @param o2 operant two
 * @returns alu result which contains the result word and the flags
 */
export function add(o1: Word, o2: Word): AluResult {
  const result: Word = o1.add(o2)
  return {
    result: result,
    N: result.hasSign(),
    Z: result.toUnsignedInteger() === 0,
    C:
      o1.toUnsignedInteger() + o2.toUnsignedInteger() > Word.MAX_UNSIGNED_VALUE,
    V: o1.hasSign() == o2.hasSign() && o1.hasSign() != result.hasSign()
  }
}

/**
 * Subtracts the two words from each other and returns the result with the correctly set flags.
 *
 * @param o1 operant one
 * @param o2 operant two
 * @returns alu result which contains the result word and the flags
 */
export function sub(o1: Word, o2: Word): AluResult {
  const complement: Word = Word.fromUnsignedInteger(
    (~o2.toUnsignedInteger() + 1) >>> 0
  )
  const result: Word = o1.add(complement)
  return {
    result: result,
    N: result.hasSign(),
    Z: result.toUnsignedInteger() === 0,
    C:
      o1.toUnsignedInteger() + complement.toUnsignedInteger() >
      Word.MAX_UNSIGNED_VALUE,
    V: o1.hasSign() != o2.hasSign() && o1.hasSign() != result.hasSign()
  }
}
