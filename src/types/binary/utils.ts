export function checkRange(
  name: string,
  value: number,
  min: number,
  max: number
) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(
      `OutOfRange: ${name} must be an integer in range ${min} to ${max} (provided: ${value}).`
    )
  }
}

/**
 * Removes all leading bits before the defined bit which are no longer part of the value.
 *
 * @param value value to limit to certain bits (only works with values lower than 2^53 [save integer])
 * @param bitCount how many bits can be used to represent the value (maximal 32)
 * @returns unsigned value of displayable value with given bits
 */
export function limitValuesToBitCount(value: number, bitCount: number): number {
  if (!Number.isSafeInteger(value)) {
    throw new Error('Value out of save integer range.')
  }
  if (bitCount < 1 || bitCount > 32 || !Number.isInteger(bitCount)) {
    throw new Error('Provided bitCount is not an integer between 1 and 32.')
  }
  //bitwise operations are limited to maximal 32 bits
  let mask = getMaxValueDisplayableWithBits(bitCount)
  return convertToUnsignedNumber(mask & value)
}

/**
 * Returns the max unsigned value which can be representet with given bits
 * @param bitCount how many bits can be used for value (positive integer value)
 * @returns
 */
export function getMaxValueDisplayableWithBits(bitCount: number) {
  if (bitCount < 1 || !Number.isInteger(bitCount)) {
    throw new Error('BitCount has to be a positive integer value (at least 1).')
  }
  return Math.pow(2, bitCount) - 1
}

/**
 * Converts negative value as number to unsigned equivalent as number.
 * Needed since 32-bit value is interpreted by javascript as signed in number type.
 * This method is used to always stay in unsigned range (only positive values including 0)
 * @param value value to convert
 * @returns unsigned value with maximal 32 bits (least significant ones)
 */
export function convertToUnsignedNumber(value: number): number {
  if (!Number.isSafeInteger(value)) {
    throw new Error('Value out of save integer range.')
  }
  return value >>> 0
}
