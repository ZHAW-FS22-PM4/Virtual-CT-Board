import { BinaryType } from './binaryType'
import { checkRange } from './utils'

/**
 * Represents a byte in range (0x00 - 0xFF).
 */
export class Byte extends BinaryType {
  public static MIN_VALUE: number = 0x00
  public static MAX_VALUE: number = 0xff
  public static MIN_UNSIGNED_VALUE: number = 0
  public static MAX_UNSIGNED_VALUE: number = 255
  public static MIN_SIGNED_VALUE: number = -128
  public static MAX_SIGNED_VALUE: number = 127
  public static ZERO_BYTE: Byte = Byte.fromUnsignedInteger(0)
  public static NUMBER_OF_BITS: number = 8

  /**
   * The unsigned integer representation of the byte as a number (IEEE double precision floating point).
   */
  public readonly value: number

  private constructor(value: number) {
    super(Byte.NUMBER_OF_BITS)
    checkRange('Byte', value, Byte.MIN_VALUE, Byte.MAX_VALUE)
    this.value = value
  }

  /**
   * Creates a new byte from an unsigned integer.
   *
   * @param value the unsigned integer value
   * @returns the byte representation
   */
  public static fromUnsignedInteger(value: number): Byte {
    checkRange(
      '8-bit unsigned integer',
      value,
      Byte.MIN_UNSIGNED_VALUE,
      Byte.MAX_UNSIGNED_VALUE
    )
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
   * Determines whether the byte does have a sign when interpreted as a signed integer.
   *
   * @returns a boolean indicating whether the byte has a sign
   */
  public hasSign(): boolean {
    return (this.value & (1 << 7)) !== 0
  }

  /**
   * Adds the specified number to the byte and returns the result as a new byte. In case the
   * result exeeds the `Byte.MAX_VALUE` then it will overflow.
   *
   * @param value the number to be added to the byte
   * @returns the new byte with the value added
   */
  public add(value: Byte | number): Byte {
    if (value instanceof Byte) {
      value = value.value
    }
    value = (value + this.value) >>> 0
    return new Byte((value & 0xff) >>> 0)
  }

  /**
   * Gets the unsigned integer representation of the byte as a number.
   *
   * @returns the unsigned integer representation as a number
   */
  public toUnsignedInteger(): number {
    return this.value
  }

  /**
   * Gets the signed integer representation of the byte as a number.
   *
   * @returns the signed integer representation as a number
   */
  public toSignedInteger(): number {
    return this.value >= Byte.MAX_VALUE / 2
      ? -1 * (Byte.MAX_VALUE - this.value + 1)
      : this.value
  }

  /**
   * Gets the binary representation of the byte as a string.
   *
   * @returns the binary representation as a string
   */
  public toBinaryString(): string {
    const byteString = this.value.toString(2)
    return byteString.padStart(8, '0')
  }

  /**
   * Gets the hexadecimal representation of the byte as a string.
   *
   * @returns the hexadecimal representation as a string
   */
  public toHexString(): string {
    const hexString = this.value.toString(16)
    return hexString.padStart(2, '0')
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
