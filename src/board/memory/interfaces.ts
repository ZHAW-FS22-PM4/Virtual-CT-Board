import { Word, Halfword, Byte } from 'types/binary'

export interface IMemory {
  readByte: (address: Word) => Byte
  readHalfword: (address: Word) => Halfword
  readWord: (address: Word) => Word
  writeByte: (address: Word, byte: Byte) => void
  writeBytes: (address: Word, bytes: Byte[]) => void
  writeHalfword: (address: Word, halfword: Halfword) => void
  writeWord: (address: Word, word: Word) => void
  clear: () => void
}
