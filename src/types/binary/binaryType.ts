import { Byte, Halfword, Word } from '.'
import { convertToUnsignedNumber } from './utils'

export abstract class BinaryType {
  public static MIN_UNSIGNED_VALUE: number = 0
  /**
   * The unsigned integer representation of the type as a number (IEEE double precision floating point).
   * Has to be always positive use toSignedInteger method to get interpretation of negative values
   */
  abstract value: number
  abstract readonly numberOfBitsForType: number
  abstract readonly maxValueForType: number

  constructor() {
    //since value here is sometimes undefined, abstract properties are used
  }

  /**
   * Creates a unsigned number from a list of bytes.
   *
   * @param numberOfBitsForType bit count used for type (divideable by 4)
   * @param bytes the list of bytes to combine within binary type (in little endian)
   * @returns the value for the binary type
   */
  public static fromBytesToNumber(
    numberOfBitsForType: number,
    ...bytes: Byte[]
  ): number {
    const maxByteCount = BinaryType.getHexCharCount(numberOfBitsForType)
    if (bytes.length > maxByteCount) {
      throw new Error('too many bytes for type provided')
    }
    let value = BinaryType.MIN_UNSIGNED_VALUE
    let shift = 0
    for (let i = 0; i < maxByteCount; i++) {
      value = convertToUnsignedNumber(
        value | ((bytes[i]?.value ?? Byte.MIN_VALUE) << shift)
      )
      shift += 8
    }
    return value
  }

  /**
   * splits a binary type into a list of bytes.
   *
   * @param byteCount how much bytes are used to represent the type
   * @param binaries the binary type to split
   * @returns list of split bytes (in little endian)
   */
  public static toBytesGeneral(
    byteCount: number,
    ...binaries: Word[] | Halfword[]
  ): Byte[] {
    const bytes: Byte[] = []
    for (const binary of binaries) {
      let value = binary.value
      for (let i = 0; i < byteCount; i++) {
        bytes.push(
          Byte.fromUnsignedInteger(
            convertToUnsignedNumber(value & Byte.MAX_VALUE)
          )
        )
        value = value >>> 8
      }
    }
    return bytes
  }

  /**
   * How many chars are required at most to represent the value in hex
   * @param numberOfBitsForType bit count used for type (divideable by 4)
   * @returns the length string for a hexadecimal representation for a type
   */
  protected static getHexCharCount(numberOfBitsForType: number): number {
    if (numberOfBitsForType % 4 !== 0) {
      throw new Error('provided bit count is not dividable by 4')
    }
    return numberOfBitsForType / 4
  }

  /**
   * checks wheter the specified bit is set or not
   * @param bitOffset 0-indexed offset from right side
   * @returns true if bit is a one else false
   */
  public isBitSet(bitOffset: number): boolean {
    this.throwErrorIfBitOffsetNotInRange(bitOffset)
    return (this.value & (1 << bitOffset)) !== 0
  }

  /**
   * Determines whether the binary type does have a sign when interpreted as a signed integer.
   *
   * @returns a boolean indicating whether the binary type has a sign
   */
  public hasSign(): boolean {
    return this.isBitSet(this.numberOfBitsForType - 1)
  }

  /**
   * Gets the unsigned integer representation of the binary type as a number.
   *
   * @returns the unsigned integer representation as a number
   */
  public toUnsignedInteger(): number {
    return this.value
  }

  /**
   * Gets the signed integer representation of the binary type as a number.
   *
   * @returns the signed integer representation as a number
   */
  public toSignedInteger(): number {
    return this.hasSign()
      ? -1 * (this.maxValueForType + 1 - this.value)
      : this.value
  }

  /**
   * Gets the binary representation of the binary type as a string.
   *
   * @returns the binary type as string
   */
  public toBinaryString(): string {
    const byteString = this.value.toString(2)
    return byteString.padStart(this.numberOfBitsForType, '0')
  }

  /**
   * Gets the hexadecimal representation of the binary type as a string.
   *
   * @returns the binary type as a hexstring
   */
  public toHexString(): string {
    const hexString = this.value.toString(16)
    return hexString.padStart(
      BinaryType.getHexCharCount(this.numberOfBitsForType),
      '0'
    )
  }

  /**
   * Adds the specified number to the binary type value and returns the result as a number.
   * In case the result exceeds the max value of the type the result is out of the range of the type.
   *
   * As long as result stays in safe integer range (below 2^53 and higher than 2^(-53) according to https://www.avioconsulting.com/blog/overcoming-javascript-numeric-precision-issues
   * there is no problem in precision. Otherwise LSB will be cut off.
   *
   * @param value the number to be added
   * @returns the unsigned result of the addition
   */
  public addToNumber(value: Byte | Halfword | Word | number): number {
    //TODO tests for this method
    if (
      value instanceof Word ||
      value instanceof Byte ||
      value instanceof Halfword
    ) {
      value = value.value
    }
    let result = value + this.value
    if (!Number.isSafeInteger(result)) {
      throw new Error('addition result is not within safe integer range')
    }
    return convertToUnsignedNumber(result)
  }

  /**
   * sets the bit with 0-indexed offset from right side to 1
   * @param bitOffset
   * @returns unsigned number with changed value
   */
  protected setBitOnNumber(bitOffset: number): number {
    this.throwErrorIfBitOffsetNotInRange(bitOffset)
    return convertToUnsignedNumber(this.value | (1 << bitOffset))
  }

  /**
   * sets the bit with 0-indexed offset from right side to 0
   * @param bitOffset
   * @returns unsigned number with changed value
   */
  protected clearBitOnNumber(bitOffset: number): number {
    this.throwErrorIfBitOffsetNotInRange(bitOffset)
    return convertToUnsignedNumber(this.value & ~(1 << bitOffset))
  }

  /**
   * sets the bit to 1 when it was 0 or to 0 if it was 1 before
   * @param bitOffset
   * @returns unsigned number with changed value
   */
  protected toggleBitOnNumber(bitOffset: number): number {
    this.throwErrorIfBitOffsetNotInRange(bitOffset)
    return this.isBitSet(bitOffset)
      ? this.clearBitOnNumber(bitOffset)
      : this.setBitOnNumber(bitOffset)
  }

  /**
   * throws system exception if offset is not smaller than count of bits for type
   * @param bitOffset 0-indexed offset
   */
  private throwErrorIfBitOffsetNotInRange(bitOffset: number): void {
    if (bitOffset >= this.numberOfBitsForType || bitOffset < 0) {
      throw new Error('bit offset (tried to access) is not within type range')
    }
  }
}
