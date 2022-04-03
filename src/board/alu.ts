import { Word } from 'types/binary'

export type AluResult = {
  result: Word
  N: boolean
  Z: boolean
  C: boolean
  V: boolean
}

/**
 * Adds the two words together and returns the result with the correctly set flags.
 *
 * @param w1 operant one
 * @param w2 operant two
 * @returns alu result which contains the result word and the flags
 */
export function add(w1: Word, w2: Word): AluResult {
  const result: Word = w1.add(w2)
  return {
    result: result,
    N: result.hasSign(),
    Z: result.toUnsignedInteger() === 0,
    C:
      w1.toUnsignedInteger() + w2.toUnsignedInteger() > Word.MAX_UNSIGNED_VALUE,
    V: w1.hasSign() == w2.hasSign() && w1.hasSign() != result.hasSign()
  }
}

/**
 * Subtracts the two words from each other and returns the result with the correctly set flags.
 *
 * @param w1 operant one
 * @param w2 operant two
 * @returns alu result which contains the result word and the flags
 */
export function sub(w1: Word, w2: Word): AluResult {
  const complement: Word = Word.fromUnsignedInteger(
    (~w2.toUnsignedInteger() + 1) >>> 0
  )
  const result: Word = w1.add(complement)
  return {
    result: result,
    N: result.hasSign(),
    Z: result.toUnsignedInteger() === 0,
    C:
      w1.toUnsignedInteger() + complement.toUnsignedInteger() >
      Word.MAX_UNSIGNED_VALUE,
    V: w1.hasSign() != w2.hasSign() && w1.hasSign() != result.hasSign()
  }
}
