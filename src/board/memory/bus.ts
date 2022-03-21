import { IDevice } from 'board/devices/interfaces'
import { Byte, Halfword, Word } from 'types/binary'
import { IMemory } from './interfaces'

export class MemoryBus implements IMemory {
  private readonly devices: IDevice[]

  constructor(devices: IDevice[]) {
    this.devices = devices
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

  public clear(): void {
    for (const device of this.devices) {
      device.clear()
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
