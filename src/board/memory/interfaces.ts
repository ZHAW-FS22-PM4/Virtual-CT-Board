import { Byte, Halfword, Word } from 'types/binary'

export interface IMemory {
  /**
   * Reads a single byte from the memory
   * @param address memory address of the byte
   * @returns read byte
   */
  readByte: (address: Word) => Byte

  /**
   * Reads a halfword from the memory
   * @param address memory address of the halfword
   * @returns read halfword
   */
  readHalfword: (address: Word) => Halfword

  /**
   * Reads a word from the memory
   * @param address memory address of the word
   * @returns read word
   */
  readWord: (address: Word) => Word

  /**
   * Writes a single byte to the memory
   * @param address memory address
   * @param byte byte to write to the memory
   */
  writeByte: (address: Word, byte: Byte) => void

  /**
   * Writes multiple bytes to the memory
   * @param address memory address
   * @param bytes Array of bytes to write
   */
  writeBytes: (address: Word, bytes: Byte[]) => void

  /**
   * Writes a halfword to the memory
   * @param address memory address
   * @param halfword halfword to write to the memory
   */
  writeHalfword: (address: Word, halfword: Halfword) => void

  /**
   * Writes a word to the memory
   * @param address memory address
   * @param word word to write to the memory
   */
  writeWord: (address: Word, word: Word) => void

  /**
   * Resets the whole memory
   */
  reset: () => void
}
