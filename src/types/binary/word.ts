import {Byte} from "./byte";
import {Halfword} from "./halfword";

export class Word {
    public static MIN_VALUE: number = 0x00000000
    public static MAX_VALUE: number = 0xFFFFFFFF
    public static MIN: Word = new Word(Word.MIN_VALUE)
    public static MAX: Word = new Word(Word.MAX_VALUE)

    public readonly value: number

    private constructor (value: number) {
      if (!Number.isInteger(value)) {
        throw new Error('Word value must be integer.')
      }
      if (value < Word.MIN_VALUE) {
        throw new Error('Word value can not be smaller than `Word.MIN_VALUE`.')
      }
      if (value > Word.MAX_VALUE) {
        throw new Error('Word value can not be larger than `Word.MAX_VALUE`.')
      }

      this.value = value
    }

    /**
     * Creates a new word from an unsigned integer.
     *
     * @param value the unsigned integer value
     * @returns the word representation
     */
    public static fromUnsignedInteger (value: number): Word {
      return new Word(value)
    }

    /**
     * Creates a new word from bytes.
     *
     * @param value the list of bytes
     * @returns the word representation
     */
    public static fromBytes (...bytes: Byte[]): Word {
      let value = Word.MIN_VALUE
      let shift = 0
      for (const byte of bytes) {
          value = (value | byte.value << shift) >>> 0
        shift += 8
      }
      return new Word(value)
    }

    /**
     * Splites a word into a list of bytes
     *
     * @param value the word to split
     * @returns list of splitted bytes
     */
    public static toBytes (...words: Word[]): Byte[] {
      const bytes: Byte[] = []
      for (const word of words) {
        let value = word.value
        while (value > Word.MIN_VALUE) {
          bytes.push(Byte.fromUnsignedInteger(value & 0xFF))
          value = value >>> 8
        }
      }
      return bytes
    }

    /**
     * Creates a new word from a list of halfwords.
     *
     * @param value the list of halfwords
     * @returns the word representation
     */
    public static fromHalfwords (...halfwords: Halfword[]): Word {
      let value = Word.MIN_VALUE
      let shift = 0
      for (const halfword of halfwords) {
        value = (value | halfword.value << shift) >>> 0
        shift += 16
      }
      return new Word(value)
    }

    /**
     * Splites a word in to a list of halfwords
     *
     * @param value the word to split
     * @returns the list of splitted halfwords
     */
    public static toHalfwords (...words: Word[]): Halfword[] {
      const halfwords: Halfword[] = []
      for (const word of words) {
        let value = word.value
        while (value > Word.MIN_VALUE) {
          halfwords.push(Halfword.fromUnsignedInteger(value & 0xFFFF))
          value = value >>> 16
        }
      }
      return halfwords
    }

    /**
     * Increments the word by a given value
     *
     * @param value by which the word should be increased
     */
    public increment (value: number): Word {
      return Word.fromUnsignedInteger(this.value + value)
    }

    /**
     * Gets the unsigned integer representation of the word as a number.
     *
     * @returns the unsigned integer representation as a number
     */
    public toUnsignedInteger (): number {
      return this.value
    }

    /**
     * Gets the signed integer representation of the word as a number.
     *
     * @returns the signed integer representation as a number
     */
    public toSignedInteger (): number {
      return (this.value >= Word.MAX_VALUE / 2) ? -1 * (Word.MAX_VALUE - this.value + 1) : this.value
    }

    /**
     * Splites the word into a list of bytes
     *
     * @param value the word to split
     * @returns the list of splitted bytes
     */
    public toBytes (): Byte[] {
      return Word.toBytes(this)
    }

    /**
     * Splites the word into a list of halfwords
     *
     * @param value the word to split
     * @returns the list of splitted halfwords
     */
    public toHalfwords (): Halfword[] {
      return Word.toHalfwords(this)
    }

    /**
     * Represents the word as string
     *
     * @ returns the word as string
     */
    public toBinaryString (): string {
      const byteString = this.value.toString(2)
      return byteString.padStart(32, '0')
    }

    /**
     * Represents the word as HexString
     *
     * @ returns the word as hexstring
     */
    public toHexString (): string {
      const hexString = this.value.toString(16)
      return hexString.padStart(8, '0')
    }
  }