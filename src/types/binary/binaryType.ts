export abstract class BinaryType {
  /**
   * The unsigned integer representation of the type as a number (IEEE double precision floating point).
   * Has to be always positive use toSignedInteger method to get interpretation of negative values
   */
  abstract value: number
  private numberOfBitsForType: number

  constructor(numberOfBitsForType: number) {
    this.numberOfBitsForType = numberOfBitsForType
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
   * Converts negative value as number to unsigned equivalent as number.
   * Needed since 32-bit value is interpreted by javascript as signed in number type.
   * This method is used to always stay in unsigned range (only positive values including 0)
   */
  protected convertToUnsignedNumber(value: number): number {
    return value >>> 0
  }

  /**
   * sets the bit with 0-indexed offset from right side to 1
   * @param bitOffset
   * @returns signed number with changed value
   */
  protected setBitOnNumber(bitOffset: number): number {
    this.throwErrorIfBitOffsetNotInRange(bitOffset)
    return this.convertToUnsignedNumber(this.value | (1 << bitOffset))
    //return this.value | (1 << bitOffset)
  }

  /**
   * sets the bit with 0-indexed offset from right side to 0
   * @param bitOffset
   * @returns signed number with changed value
   */
  protected clearBitOnNumber(bitOffset: number): number {
    this.throwErrorIfBitOffsetNotInRange(bitOffset)
    return this.convertToUnsignedNumber(this.value & ~(1 << bitOffset))
  }
  /**
   * sets the bit to 1 when it was 0 or to 0 if it was 1 before
   * @param bitOffset
   * @returns signed number with changed value
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
