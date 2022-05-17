import { Memory } from 'board/memory'
import { IMemory, MemoryEvents } from 'board/memory/interfaces'
import { Byte, Halfword, Word } from 'types/binary'
import { EventEmitter } from 'types/events/emitter'
import { forward } from 'types/events/utils'
import { IDevice } from './interfaces'

export abstract class Device
  extends EventEmitter<MemoryEvents>
  implements IDevice
{
  protected readonly memory: IMemory

  public abstract readonly startAddress: Word
  public abstract readonly endAddress: Word
  public abstract readonly isReadOnly: boolean
  public abstract readonly isVolatile: boolean

  constructor() {
    super()
    this.memory = new Memory()
    forward<MemoryEvents>([this.memory], this)
  }

  public isResponsibleFor(address: Word): boolean {
    return (
      address.value >= this.startAddress.value &&
      address.value <= this.endAddress.value
    )
  }

  public readByte(address: Word): Byte {
    return this.memory.readByte(address)
  }

  public readHalfword(address: Word): Halfword {
    return this.memory.readHalfword(address)
  }

  public readWord(address: Word): Word {
    return this.memory.readWord(address)
  }

  public writeByte(address: Word, byte: Byte): void {
    if (this.isReadOnly) {
      return
    }
    this.memory.writeByte(address, byte)
  }

  public writeBytes(address: Word, bytes: Byte[]): void {
    if (this.isReadOnly) {
      return
    }
    this.memory.writeBytes(address, bytes)
  }

  public writeHalfword(address: Word, halfword: Halfword): void {
    if (this.isReadOnly) {
      return
    }
    this.memory.writeHalfword(address, halfword)
  }

  public writeWord(address: Word, word: Word): void {
    if (this.isReadOnly) {
      return
    }
    this.memory.writeWord(address, word)
  }

  public reset(): void {
    if (this.isVolatile) {
      this.memory.reset()
    }
  }
}
