/**
 * Represents a byte in range (0x00 - 0xFF).
 */
export class Byte {
  public static MIN_VALUE: number = 0x00
  public static MAX_VALUE: number = 0xFF
  public static MIN_UNSIGNED_VALUE: number = 0
  public static MAX_UNSIGNED_VALUE: number = 255
  public static MIN_SIGNED_VALUE: number = -128
  public static MAX_SIGNED_VALUE: number = 127

  /**
   * The unsigned integer representation of the byte as a number (IEEE double precision floating point).
   */
  public readonly value: number

  private constructor(value: number) {
    Byte.checkRange("Byte", value, Byte.MIN_VALUE, Byte.MAX_VALUE)
    this.value = value
  }

  /**
   * Creates a new byte from an unsigned integer.
   * 
   * @param value the unsigned integer value
   * @returns the byte representation
   */
  public static fromUnsignedInteger(value: number): Byte {
    Byte.checkRange("8-bit signed integer", value, Byte.MIN_UNSIGNED_VALUE, Byte.MAX_UNSIGNED_VALUE)
    return new Byte(value)
  }

  /**
   * Creates a new byte from a signed integer.
   * 
   * @param value the signed integer value
   * @returns the byte representation
   */
  public static fromSignedInteger(value: number): Byte {
    Byte.checkRange("8-bit unsigned integer", value, Byte.MIN_SIGNED_VALUE, Byte.MAX_SIGNED_VALUE)
    if (value < 0) {
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
    return (this.value & 0x80) !== 0
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

    let newValue = (this.value + value) % Byte.MAX_VALUE + 1;
    newValue = (newValue < 0) ? Byte.MAX_VALUE - newValue: newValue;

    return new Byte(newValue)
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
    return (this.value >= Byte.MAX_VALUE / 2) ? -1 * (Byte.MAX_VALUE - this.value + 1) : this.value
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

  private static checkRange(name: string, value: number, min: number, max: number) {
    if (!Number.isInteger(value) || value < Byte.MIN_VALUE || value > Byte.MAX_VALUE) {
      throw new Error(`OutOfRange: ${name} must be an integer in range ${min} to ${max}.`)
    }
  }
}