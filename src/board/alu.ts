import { Word } from 'types/binary'
import { Flag, IFlag } from './registers'

export type AluResult = {
  result: Word
  flags: IFlag
}

/**
 * Evaluates the zero and negative flags for the given word.
 *
 * @param w word to evaluate
 * @returns zero and negative flags for the given word
 */
export function evaluateZeroAndNegativeFlags(w: Word): IFlag {
  return {
    [Flag.Z]: w.toUnsignedInteger() === 0,
    [Flag.N]: w.hasSign()
  }
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
  const flags = evaluateZeroAndNegativeFlags(result)
  flags[Flag.C] =
    w1.toUnsignedInteger() + w2.toUnsignedInteger() > Word.MAX_VALUE
  flags[Flag.V] =
    w1.hasSign() === w2.hasSign() && w1.hasSign() != result.hasSign()

  return {
    result: result,
    flags: flags
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
  const comp: Word = Word.fromUnsignedInteger(
    (~w2.toUnsignedInteger() + 1) >>> 0
  )
  const result: Word = w1.add(comp)
  const flags = evaluateZeroAndNegativeFlags(result)
  flags[Flag.C] =
    w1.toUnsignedInteger() + comp.toUnsignedInteger() > Word.MAX_VALUE
  flags[Flag.V] =
    w1.hasSign() != w2.hasSign() && w1.hasSign() != result.hasSign()

  // Special case: In case carry happens during complement computation,
  // the carry flag needs to be set. This can only happen for zero.
  if (comp.value === 0) {
    flags[Flag.C] = true
  }

  return {
    result: result,
    flags: flags
  }
}

/**
 * Multiplies the two words together and returns the result with the correctly set flags. For multiplication only N and Z flag are returned.
 *
 * @param w1 word one
 * @param w2 word two
 * @returns alu result which contains the result word and the flags
 */
export function mul(w1: Word, w2: Word): AluResult {
  const mul = BigInt(w1.toUnsignedInteger()) * BigInt(w2.toUnsignedInteger())
  const cut = mul & BigInt(Word.MAX_VALUE)
  const result: Word = Word.fromUnsignedInteger(Number(cut))

  return {
    result: result,
    flags: evaluateZeroAndNegativeFlags(result)
  }
}
