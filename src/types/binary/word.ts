import { checkRange } from './utils'
import { Byte, BinaryType } from './binaryType'
import { Halfword } from './halfword'

/**
 * Represents a word in range (0x00000000 - 0xFFFFFFFF).
 */
export class Word extends BinaryType {
  public static MIN_VALUE: number = 0
  public static MAX_VALUE: number = 0xffffffff //decimal: 4294967295
  public static MIN_SIGNED_VALUE: number = -2147483648
  public static MAX_SIGNED_VALUE: number = 2147483647
  public static NUMBER_OF_BITS: number = 32

  readonly numberOfBitsForType: number = Word.NUMBER_OF_BITS
  readonly maxValueForType: number = 0xffffffff

  /**
   * The unsigned integer representation of the word as a number (IEEE double precision floating point).
   */
  public readonly value: number

  private constructor(value: number) {
    super()
    checkRange('Word', value, Word.MIN_VALUE, Word.MAX_VALUE)
    this.value = value
  }

  /**
   * Creates a new word from an unsigned integer.
   *
   * @param value the unsigned integer value
   * @returns the word representation
   */
  public static fromUnsignedInteger(value: number): Word {
    checkRange('32-bit unsigned integer', value, Word.MIN_VALUE, Word.MAX_VALUE)
    return new Word(value)
  }

  /**
   * Creates a new word from a signed integer.
   *
   * @param value the signed integer value
   * @returns the word representation
   */
  public static fromSignedInteger(value: number): Word {
    checkRange(
      '32-bit signed integer',
      value,
      Word.MIN_SIGNED_VALUE,
      Word.MAX_SIGNED_VALUE
    )
    if (value < Word.MIN_VALUE) {
      return new Word(Word.MAX_VALUE + value + 1)
    }
    return new Word(value)
  }

  /**
   * Creates a new word from bytes.
   *
   * @param bytes the list of bytes (in little endian)
   * @returns the word representation
   */
  public static fromBytes(...bytes: Byte[]): Word {
    return new Word(this.fromBytesToNumber(Word.NUMBER_OF_BITS, ...bytes))
  }

  /**
   * splits a word into a list of bytes.
   *
   * @param words the word to split
   * @returns list of split bytes (in little endian)
   */
  public static toBytes(...words: Word[]): Byte[] {
    return BinaryType.toBytesGeneral(Word.NUMBER_OF_BITS / 8, ...words)
  }

  /**
   * Creates a new word from a list of halfwords.
   *
   * @param halfwords the list of halfwords
   * @returns the word representation (in little endian)
   */
  public static fromHalfwords(...halfwords: Halfword[]): Word {
    let value = Word.MIN_VALUE
    let shift = 0
    for (let i = 0; i < 2; i++) {
      value =
        (value | ((halfwords[i]?.value ?? Halfword.MIN_VALUE) << shift)) >>> 0
      shift += 16
    }
    return new Word(value)
  }

  /**
   * splits a word in to a list of halfwords.
   *
   * @param words the word to split
   * @returns the list of split halfwords (in little endian)
   */
  public static toHalfwords(...words: Word[]): Halfword[] {
    const halfwords: Halfword[] = []
    for (const word of words) {
      let value = word.value
      for (let i = 0; i < 2; i++) {
        halfwords.push(Halfword.fromUnsignedInteger((value & 0xffff) >>> 0))
        value = value >>> 16
      }
    }
    return halfwords
  }

  /**
   * Adds the specified number to the word and returns the result as a new word. In case the
   * result exceeds the `Word.MAX_VALUE` then it will overflow.
   *
   * @param value the number to be added to the word
   * @returns the new word with the value added
   */
  public add(value: Word | number): Word {
    return new Word(this.limitValueToTypeRange(this.addToNumber(value)))
  }

  /**
   * splits the word into a list of bytes
   *
   * @returns the list of split bytes (in little endian)
   */
  public toBytes(): Byte[] {
    return Word.toBytes(this)
  }

  /**
   * splits the word into a list of halfwords
   *
   * @returns the list of split halfwords (in little endian)
   */
  public toHalfwords(): Halfword[] {
    return Word.toHalfwords(this)
  }

  /**
   * sets the bit with 0-indexed offset from right side to 1
   * @param bitOffset
   * @returns new Word instance with changed value
   */
  public setBit(bitOffset: number): Word {
    return Word.fromUnsignedInteger(this.setBitOnNumber(bitOffset))
  }

  /**
   * sets the bit with 0-indexed offset from right side to 0
   * @param bitOffset
   * @returns new Word instance with changed value
   */
  public clearBit(bitOffset: number): Word {
    return Word.fromUnsignedInteger(this.clearBitOnNumber(bitOffset))
  }
  /**
   * sets the bit to 1 when it was 0 or to 0 if it was 1 before
   * @param bitOffset
   * @returns new Word instance with changed value
   */
  public toggleBit(bitOffset: number): Word {
    return Word.fromUnsignedInteger(this.toggleBitOnNumber(bitOffset))
  }
}
