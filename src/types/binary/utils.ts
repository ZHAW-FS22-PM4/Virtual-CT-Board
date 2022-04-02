import { parse } from 'assembler/parser'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'

export function checkRange(
  name: string,
  value: number,
  min: number,
  max: number
) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new VirtualBoardError(
      `OutOfRange: ${name} must be an integer in range ${min} to ${max} (provided: ${value}).`,
      VirtualBoardErrorType.BinaryTypeOutOfRange
    )
  }
}

/**
 * Removes all leading bits before the defined bit which are no longer part of the value.
 *
 * @param value value to limit to certain bits
 * @param bitCount how many bits can be used to represent the value
 * @returns unsigned value of displayable value with given bits
 */
export function limitValuesToBitCount(value: number, bitCount: number): number {
  return convertToUnsignedNumber(parseInt('f'.repeat(bitCount / 4), 16) & value)
}

/**
 * Converts negative value as number to unsigned equivalent as number.
 * Needed since 32-bit value is interpreted by javascript as signed in number type.
 * This method is used to always stay in unsigned range (only positive values including 0)
 * @param value value to convert
 * @returns unsigned value
 */
export function convertToUnsignedNumber(value: number): number {
  return value >>> 0
}
