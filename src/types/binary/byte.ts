import { BinaryType } from './binaryType'
import { checkRange, limitValuesToBitCount } from './utils'

/**
 * Represents a byte in range (0x00 - 0xFF).
 */
export class Byte extends BinaryType {
  public static MIN_VALUE: number = 0
  public static MAX_VALUE: number = 0xff //decimal: 255
  public static MIN_SIGNED_VALUE: number = -128
  public static MAX_SIGNED_VALUE: number = 127
  public static readonly ZERO_BYTE: Byte = Byte.fromUnsignedInteger(0)

  readonly numberOfBitsForType: number = 8
  readonly maxValueForType: number = 0xff

  /**
   * The unsigned integer representation of the byte as a number (IEEE double precision floating point).
   */
  public readonly value: number

  private constructor(value: number) {
    super()
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
    return new Byte(
      limitValuesToBitCount(this.addToNumber(value), this.numberOfBitsForType)
    )
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
