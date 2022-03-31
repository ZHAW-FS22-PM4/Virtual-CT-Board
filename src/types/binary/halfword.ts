import { checkRange } from './utils'
import { Byte } from './byte'
import { BinaryType } from './binaryType'

/**
 * Represents a halfword in range (0x0000 - 0xFFFF).
 */
export class Halfword extends BinaryType {
  public static MIN_VALUE: number = 0x0000
  public static MAX_VALUE: number = 0xffff
  public static MIN_UNSIGNED_VALUE: number = 0
  public static MAX_UNSIGNED_VALUE: number = 65535
  public static MIN_SIGNED_VALUE: number = -32768
  public static MAX_SIGNED_VALUE: number = 32767
  public static NUMBER_OF_BITS: number = 16

  /**
   * The unsigned integer representation of the halfword as a number (IEEE double precision floating point).
   */
  public readonly value: number

  private constructor(value: number) {
    super(Halfword.NUMBER_OF_BITS)
    checkRange('Halfword', value, Halfword.MIN_VALUE, Halfword.MAX_VALUE)
    this.value = value
  }

  /**
   * Creates a new halfword from an unsigned integer.
   *
   * @param value the unsigned integer value
   * @returns the halfword representation
   */
  public static fromUnsignedInteger(value: number): Halfword {
    checkRange(
      '16-bit unsigned integer',
      value,
      Halfword.MIN_UNSIGNED_VALUE,
      Halfword.MAX_UNSIGNED_VALUE
    )
    return new Halfword(value)
  }

  /**
   * Creates a new halfword from a signed integer.
   *
   * @param value the signed integer value
   * @returns the halfword representation
   */
  public static fromSignedInteger(value: number): Halfword {
    checkRange(
      '16-bit signed integer',
      value,
      Halfword.MIN_SIGNED_VALUE,
      Halfword.MAX_SIGNED_VALUE
    )
    if (value < Halfword.MIN_VALUE) {
      return new Halfword(Halfword.MAX_VALUE + value + 1)
    }
    return new Halfword(value)
  }

  /**
   * Creates a new halfword from a list of bytes.
   *
   * @param bytes the list of bytes to combine within a halfword (in little endian)
   * @returns the halfword representation
   */
  public static fromBytes(...bytes: Byte[]): Halfword {
    let value = Halfword.MIN_VALUE
    let shift = 0
    for (let i = 0; i < 2; i++) {
      value = (value | ((bytes[i]?.value ?? Byte.MIN_VALUE) << shift)) >>> 0
      shift += 8
    }
    return new Halfword(value)
  }

  /**
   * Splites the halfword list into bytes.
   *
   * @param halfwords halfword list to split
   * @returns the list of splited bytes (in little endian)
   */
  public static toBytes(...halfwords: Halfword[]): Byte[] {
    const bytes: Byte[] = []
    for (const halfword of halfwords) {
      let value = halfword.value
      for (let i = 0; i < 2; i++) {
        bytes.push(Byte.fromUnsignedInteger((value & 0xff) >>> 0))
        value = value >>> 8
      }
    }
    return bytes
  }

  /**
   * Determines whether the halfword does have a sign when interpreted as a signed integer.
   *
   * @returns a boolean indicating whether the halfword has a sign
   */
  public hasSign(): boolean {
    return (this.value & (1 << 15)) !== 0
  }

  /**
   * Adds the specified number to the halfword and returns the result as a new halfword. In case the
   * result exeeds the `Halfword.MAX_VALUE` then it will overflow.
   *
   * @param value the number to be added to the halfword
   * @returns the new halfword with the value added
   */
  public add(value: Halfword | number): Halfword {
    if (value instanceof Halfword) {
      value = value.value
    }
    value = (value + this.value) >>> 0
    return new Halfword((value & 0xffff) >>> 0)
  }

  /**
   * Gets the unsigned integer representation of the halfword as a number.
   *
   * @returns the unsigned integer representation as a number
   */
  public toUnsignedInteger(): number {
    return this.value
  }

  /**
   * Gets the signed integer representation of the halfword as a number.
   *
   * @returns the signed integer representation as a number
   */
  public toSignedInteger(): number {
    return this.value >= Halfword.MAX_VALUE / 2
      ? -1 * (Halfword.MAX_VALUE - this.value + 1)
      : this.value
  }

  /**
   * Splites the halfword into bytes.
   *
   * @returns the list of splited bytes (in little endian)
   */
  public toBytes(): Byte[] {
    return Halfword.toBytes(this)
  }

  /**
   * Represents the halfword as string
   *
   * @returns the halfword as string
   */
  public toBinaryString(): string {
    const byteString = this.value.toString(2)
    return byteString.padStart(16, '0')
  }

  /**
   * Represents the halfword as HexString
   *
   * @returns the halfword as hexstring
   */
  public toHexString(): string {
    const hexString = this.value.toString(16)
    return hexString.padStart(4, '0')
  }

  /**
   * sets the bit with 0-indexed offset from right side to 1
   * @param bitOffset
   * @returns new Halfword instance with changed value
   */
  public setBit(bitOffset: number): Halfword {
    return Halfword.fromUnsignedInteger(this.setBitOnNumber(bitOffset))
  }

  /**
   * sets the bit with 0-indexed offset from right side to 0
   * @param bitOffset
   * @returns new Halfword instance with changed value
   */
  public clearBit(bitOffset: number): Halfword {
    return Halfword.fromUnsignedInteger(this.clearBitOnNumber(bitOffset))
  }
  /**
   * sets the bit to 1 when it was 0 or to 0 if it was 1 before
   * @param bitOffset
   * @returns new Halfword instance with changed value
   */
  public toggleBit(bitOffset: number): Halfword {
    return Halfword.fromUnsignedInteger(this.toggleBitOnNumber(bitOffset))
  }
}
