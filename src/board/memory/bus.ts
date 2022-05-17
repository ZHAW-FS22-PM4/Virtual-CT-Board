import { IDevice } from 'board/devices/interfaces'
import { Byte, Halfword, Word } from 'types/binary'
import { EventEmitter } from 'types/events/emitter'
import { forward } from 'types/events/utils'
import { IMemory, MemoryEvents } from './interfaces'

export class MemoryBus extends EventEmitter<MemoryEvents> implements IMemory {
  private readonly devices: IDevice[]

  constructor(devices: IDevice[]) {
    super()
    this.devices = devices
    forward<MemoryEvents>(this.devices, this)
  }

  public readByte(address: Word): Byte {
    return this.findDevice(address).readByte(address)
  }

  public readHalfword(address: Word): Halfword {
    return this.findDevice(address).readHalfword(address)
  }

  public readWord(address: Word): Word {
    return this.findDevice(address).readWord(address)
  }

  public writeByte(address: Word, byte: Byte): void {
    this.findDevice(address).writeByte(address, byte)
  }

  public writeBytes(address: Word, bytes: Byte[]): void {
    this.findDevice(address).writeBytes(address, bytes)
  }

  public writeHalfword(address: Word, halfword: Halfword): void {
    this.findDevice(address).writeHalfword(address, halfword)
  }

  public writeWord(address: Word, word: Word): void {
    this.findDevice(address).writeWord(address, word)
  }

  public reset(): void {
    for (const device of this.devices) {
      device.reset()
    }
  }

  private findDevice(address: Word): IDevice {
    for (const device of this.devices) {
      if (device.isResponsibleFor(address)) {
        return device
      }
    }
    throw new Error(
      `Could not find a device responsible for the address '0x${address.toHexString()}'.`
    )
  }
}
