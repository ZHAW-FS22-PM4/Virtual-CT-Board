import { BinaryType } from 'types/binary/binaryType'
import { checkRange } from 'types/binary/utils'

export class Imm11 extends BinaryType {
  public static MIN_VALUE: number = 0
  public static MAX_VALUE: number = 2047
  public static MIN_SIGNED_VALUE: number = -1024
  public static MAX_SIGNED_VALUE: number = 1023
  public static NUMBER_OF_BITS: number = 11

  readonly numberOfBitsForType: number = Imm11.NUMBER_OF_BITS
  readonly maxValueForType: number = Imm11.MAX_VALUE

  /**
   * The unsigned integer representation of the imm11 as a number (IEEE double precision floating point).
   */
  public readonly value: number

  private constructor(value: number) {
    super()
    checkRange('Imm11', value, Imm11.MIN_VALUE, Imm11.MAX_VALUE)
    this.value = value
  }

  /**
   * Creates a new imm11 from an unsigned integer.
   *
   * @param value the unsigned integer value
   * @returns the imm11 representation
   */
  public static fromUnsignedInteger(value: number): Imm11 {
    checkRange(
        '11-bit unsigned integer',
        value,
        Imm11.MIN_VALUE,
        Imm11.MAX_VALUE
    )
    return new Imm11(value)
  }
}
