import { checkRange, convertToUnsignedNumber } from './utils'

export interface IByte {
  readonly value: number
}

export class BinaryType {
  public static MIN_UNSIGNED_VALUE: number = 0
  /**
   * The unsigned integer representation of the type as a number (IEEE double precision floating point).
   * Has to be always positive use toSignedInteger method to get interpretation of negative values
   */
  public readonly value: number
  public readonly numberOfBitsForType: number
  public readonly maxValueForType: number

  constructor(value: number, numberOfBitsForType: number) {
    this.value = value
    this.numberOfBitsForType = numberOfBitsForType
    this.maxValueForType = Math.pow(2, numberOfBitsForType) - 1
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
    ...bytes: IByte[]
  ): number {
    const maxByteCount = BinaryType.getByteCount(numberOfBitsForType)
    if (bytes.length > maxByteCount) {
      throw new Error('Too many bytes for type provided.')
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
    ...binaries: BinaryType[]
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
  public static getHexCharCount(numberOfBitsForType: number): number {
    if (numberOfBitsForType % 4 !== 0) {
      throw new Error('Provided bit count is not dividable by 4.')
    }
    return numberOfBitsForType / 4
  }

  /**
   * How many bytes are required at most to represent the value with bytes
   * @param numberOfBitsForType bit count used for type (divideable by 8)
   * @returns the number of bytes which can be used at most for representation of type
   */
  public static getByteCount(numberOfBitsForType: number): number {
    if (numberOfBitsForType % 8 !== 0) {
      throw new Error('Provided bit count is not dividable by 8.')
    }
    return numberOfBitsForType / 8
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
   * As long as result stays in safe integer range (below 2^53 and higher than 2^(-53) according to
   * https://www.avioconsulting.com/blog/overcoming-javascript-numeric-precision-issues
   * there is no problem in precision. Otherwise LSB will be cut off.
   *
   * @param value the number to be added
   * @returns the unsigned result of the addition
   */
  public addToNumber(value: BinaryType | number): number {
    if (!(typeof value === 'number')) {
      value = value.value
    }
    let result = value + this.value
    if (!Number.isSafeInteger(result)) {
      throw new Error('Addition result is not within safe integer range.')
    }
    return convertToUnsignedNumber(result)
  }

  protected limitValueToTypeRange(value: number) {
    if (!Number.isSafeInteger(value)) {
      throw new Error('Value out of save integer range.')
    }
    return convertToUnsignedNumber(this.maxValueForType & value)
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
      throw new Error('Bit offset (tried to access) is not within type range.')
    }
  }
}

/**
 * Represents a byte in range (0x00 - 0xFF).
 */
export class Byte extends BinaryType implements IByte {
  public static MIN_VALUE: number = 0
  public static MAX_VALUE: number = 0xff //decimal: 255
  public static MIN_SIGNED_VALUE: number = -128
  public static MAX_SIGNED_VALUE: number = 127
  public static NUMBER_OF_BITS: number = 8

  private constructor(value: number) {
    super(value, Byte.NUMBER_OF_BITS)
    checkRange('Byte', value, Byte.MIN_VALUE, Byte.MAX_VALUE)
  }

  /**
   * Creates a new byte from an unsigned integer.
   *
   * @param value the unsigned integer value
   * @returns the byte representation
   */
  public static fromUnsignedInteger(value: number): Byte {
    checkRange('8-bit unsigned integer', value, Byte.MIN_VALUE, Byte.MAX_VALUE)
    return new Byte(value)
  }

  /**
   * Creates a new byte from a signed integer.
   *
   * @param value the signed integer value
   * @returns the byte representation
   */
  public static fromSignedInteger(value: number): Byte {
    checkRange(
      '8-bit signed integer',
      value,
      Byte.MIN_SIGNED_VALUE,
      Byte.MAX_SIGNED_VALUE
    )
    if (value < Byte.MIN_VALUE) {
      return new Byte(Byte.MAX_VALUE + value + 1)
    }
    return new Byte(value)
  }
  /**
   * Adds the specified number to the byte and returns the result as a new byte. In case the
   * result exceeds the `Byte.MAX_VALUE` then it will overflow.
   *
   * @param value the number to be added to the byte
   * @returns the new byte with the value added
   */
  public add(value: Byte | number): Byte {
    return new Byte(this.limitValueToTypeRange(this.addToNumber(value)))
  }
  /**
   * sets the bit with 0-indexed offset from right side to 1
   * @param bitOffset
   * @returns new Byte instance with changed value
   */
  public setBit(bitOffset: number): Byte {
    return Byte.fromUnsignedInteger(this.setBitOnNumber(bitOffset))
  }

  /**
   * sets the bit with 0-indexed offset from right side to 0
   * @param bitOffset
   * @returns new Byte instance with changed value
   */
  public clearBit(bitOffset: number): Byte {
    return Byte.fromUnsignedInteger(this.clearBitOnNumber(bitOffset))
  }
  /**
   * sets the bit to 1 when it was 0 or to 0 if it was 1 before
   * @param bitOffset
   * @returns new Byte instance with changed value
   */
  public toggleBit(bitOffset: number): Byte {
    return Byte.fromUnsignedInteger(this.toggleBitOnNumber(bitOffset))
  }
}
