import { Byte } from './byte'

export class Halfword {
  public static MIN_VALUE: number = 0x0000
  public static MAX_VALUE: number = 0xffff

  public readonly value: number

  private constructor(value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('Halfword value must be integer.')
    }
    if (value < Halfword.MIN_VALUE) {
      throw new Error(
        'Halfword value can not be smaller than `Halfword.MIN_VALUE`.'
      )
    }
    if (value > Halfword.MAX_VALUE) {
      throw new Error(
        'Halfword value can not be larger than `Halfword.MAX_VALUE`.'
      )
    }

    this.value = value
  }

  /**
   * Creates a new byte from an unsigned integer.
   *
   * @param value the unsigned integer value
   * @returns the halword representation
   */
  public static fromUnsignedInteger(value: number): Halfword {
    return new Halfword(value)
  }

  /**
   * Creates a new halfword from a list of bytes.
   *
   * @param bytes the list of bytes to combine within a halfword
   * @returns the halfword representation
   */
  public static fromBytes(...bytes: Byte[]): Halfword {
    let value = Halfword.MIN_VALUE
    let shift = 0
    for (const byte of bytes) {
      value = (value | (byte.value << shift)) >>> 0
      shift += 8
    }
    return new Halfword(value)
  }

  /**
   * Splites the halfword list into bytes.
   *
   * @param halfwords halfword list to split
   * @ returns the list of splited bytes
   */
  public static toBytes(...halfwords: Halfword[]): Byte[] {
    const bytes: Byte[] = []
    for (const halfword of halfwords) {
      let value = halfword.value
      while (value > Halfword.MIN_VALUE) {
        bytes.push(Byte.fromUnsignedInteger(value & 0xff))
        value >>= 8
      }
    }
    return bytes
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
   * @ returns the list of splited bytes
   */
  public toBytes(): Byte[] {
    return Halfword.toBytes(this)
  }

  /**
   * Represents the halfword as string
   *
   * @ returns the halfword as string
   */
  public toBinaryString(): string {
    const byteString = this.value.toString(2)
    return byteString.padStart(16, '0')
  }

  /**
   * Represents the halfword as HexString
   *
   * @ returns the halfword as hexstring
   */
  public toHexString(): string {
    const hexString = this.value.toString(16)
    return hexString.padStart(4, '0')
  }
}
