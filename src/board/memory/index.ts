import { Word, Halfword, Byte } from 'types/binary'

import { IMemory } from './interfaces'

interface IMemoryData {
  [address: number]: number
}

export class Memory implements IMemory {
  private data: IMemoryData

  constructor() {
    this.data = {}
  }

  public readByte(address: Word): Byte {
    if (address.value in this.data) {
      return Byte.fromUnsignedInteger(this.data[address.value])
    }
    return Byte.fromUnsignedInteger(0x00)
  }

  public readHalfword(address: Word): Halfword {
    return Halfword.fromBytes(
      this.readByte(address.add(0)),
      this.readByte(address.add(1))
    )
  }

  public readWord(address: Word): Word {
    return Word.fromBytes(
      this.readByte(address.add(0)),
      this.readByte(address.add(1)),
      this.readByte(address.add(2)),
      this.readByte(address.add(3))
    )
  }

  public writeByte(address: Word, byte: Byte): void {
    this.data[address.value] = byte.value
  }

  public writeBytes(address: Word, bytes: Byte[]): void {
    for (const byte of bytes) {
      this.writeByte(address, byte)
      address = address.add(1)
    }
  }

  public writeHalfword(address: Word, halfword: Halfword): void {
    this.writeBytes(address, halfword.toBytes())
  }

  public writeWord(address: Word, word: Word): void {
    this.writeBytes(address, word.toBytes())
  }

  public clear(): void {
    this.data = {}
  }
}
