import { Device } from 'board/devices/device'
import { Byte, Halfword, Word } from '../../../types/binary'

const segmentsMap: Map<number, boolean[]> = new Map<number, boolean[]>()
segmentsMap.set(0, [false, false, true, true, true, true, true, true])
segmentsMap.set(1, [false, false, false, false, false, true, true, false])
segmentsMap.set(2, [false, true, false, true, true, false, true, true])
segmentsMap.set(3, [false, true, false, false, true, true, true, true])
segmentsMap.set(4, [false, true, true, false, false, true, true, false])
segmentsMap.set(5, [false, true, true, false, true, true, false, true])
segmentsMap.set(6, [false, true, true, true, true, true, false, true])
segmentsMap.set(7, [false, false, false, false, false, true, true, true])
segmentsMap.set(8, [false, true, true, true, true, true, true, true])
segmentsMap.set(9, [false, true, true, false, true, true, true, true])
segmentsMap.set(10, [false, true, true, true, false, true, true, true])
segmentsMap.set(11, [false, true, true, true, true, true, false, false])
segmentsMap.set(12, [false, false, true, true, true, false, false, true])
segmentsMap.set(13, [false, true, false, true, true, true, true, false])
segmentsMap.set(14, [false, true, true, true, true, false, false, true])
segmentsMap.set(15, [false, true, true, true, false, false, false, true])

export class SevenSegmentDevice extends Device {
  public startAddress = Word.fromUnsignedInteger(0x60000110)
  public endAddress = Word.fromUnsignedInteger(0x60000115)
  private static readonly segmentModeAddress2 =
    Word.fromUnsignedInteger(0x60000111)
  private static readonly startAddressBin = Word.fromUnsignedInteger(0x60000114)
  private static readonly endAddressBin = Word.fromUnsignedInteger(0x60000115)
  private static readonly UNUSED = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]
  public isReadOnly = false
  public isVolatile = true

  private isBinaryMode: boolean
  private isOn: boolean

  constructor() {
    super()
    this.writeWord(this.startAddress, Word.fromUnsignedInteger(0xffffffff))
    this.isOn = false
    this.isBinaryMode = false
  }
  /**
   * Returns an array of segment positions,true if seg on position should be on.
   * the values are read from the newer updated datasection and interpreted accordingly
   *
   * @param display display to get (0-3)
   * @returns segmentArray an array of boolean, true if segment is turned on
   */
  public getDisplay(display: number): boolean[] {
    if (display < 0 || display > 3) {
      throw new Error(`invalid display position ${display}`)
    }
    if (!this.isOn) {
      return SevenSegmentDevice.UNUSED
    }
    if (this.isBinaryMode) {
      return this.getDisplayBinaryMode(display)
    } else {
      return this.getDisplaySegmentControlMode(display)
    }
  }

  /**
   * Returns an array of segment positions,true if seg on position should be on.
   * the values are read from the datasection and interpreted binary
   *
   * @param display to check (0-3)
   * @returns segmentArray an array of boolean, true if segment is turned on
   */
  private getDisplayBinaryMode(display: number): boolean[] {
    let arr: boolean[] | undefined = []

    switch (display) {
      case 0:
        arr = segmentsMap.get(
          this.memory
            .readByte(SevenSegmentDevice.startAddressBin)
            .toUnsignedInteger() % 16
        )
        break
      case 1:
        arr = segmentsMap.get(
         Math.floor(this.memory
            .readByte(SevenSegmentDevice.startAddressBin)
            .toUnsignedInteger() / 16)
        )
        break
      case 2:
        arr = segmentsMap.get(
          this.memory
            .readByte(SevenSegmentDevice.endAddressBin)
            .toUnsignedInteger() % 16
        )
        break
      case 3:
        arr = segmentsMap.get(
          Math.floor(this.memory
            .readByte(SevenSegmentDevice.endAddressBin)
            .toUnsignedInteger() / 16)
        )
        break
    }
    if (arr) {
      return arr
    }
    return []
  }

  /**
   * Returns an array of segment positions,true if seg on position should be on.
   * the values are read from the datasection and interpreted hexadecimal
   *
   * @param display to check (0-3)
   * @returns segmentArray an array of boolean, true if segment is turned on
   */
  private getDisplaySegmentControlMode(display: number): boolean[] {
    let arr: boolean[] = []
    let byte = this.readByte(this.startAddress.add(display))
    for (let i = 0; i < 8; i++) {
      arr[i] = !byte.isBitSet(i)
    }
    return arr
  }

  public writeByte(address: Word, byte: Byte): void {
    if (address.toUnsignedInteger() > this.endAddress.toUnsignedInteger()) {
      return
    }
    this.isOn = true
    this.setMode(address)
    if (address.toUnsignedInteger() === this.startAddress.toUnsignedInteger()) {
      super.writeByte(SevenSegmentDevice.startAddressBin, byte)
    }
    if (
      address.toUnsignedInteger() ===
      SevenSegmentDevice.segmentModeAddress2.toUnsignedInteger()
    ) {
      super.writeByte(SevenSegmentDevice.endAddressBin, byte)
    }
    if (
      address.toUnsignedInteger() ===
      SevenSegmentDevice.startAddressBin.toUnsignedInteger()
    ) {
      super.writeByte(this.startAddress, byte)
    }
    if (
      address.toUnsignedInteger() ===
      SevenSegmentDevice.endAddressBin.toUnsignedInteger()
    ) {
      super.writeByte(SevenSegmentDevice.segmentModeAddress2, byte)
    }

    super.writeByte(address, byte)
  }

  public writeBytes(address: Word, bytes: Byte[]): void {
    for (let byte of bytes) {
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

  public reset(): void {
    this.isOn = false
    super.reset()
  }
  private setMode(adress: Word): void {
    if (
      adress.toUnsignedInteger() >=
      SevenSegmentDevice.startAddressBin.toUnsignedInteger()
    ) {
      this.isBinaryMode = true
    } else {
      this.isBinaryMode = false
    }
  }
}
