import { Device } from 'board/devices/device'
import { Byte, Halfword, Word } from 'types/binary'

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

/**
 * Represents the seven segment display. The seven segment display can be in two modes:
 * - binary control mode : display the content of the memory at address 0x60000114-0x60000115 in hex-format
 * - segment control mode : displays the contents of the memory at address 0x60000110-0x60000113 where the
 *   a logical 0 means that the segment is turned on whereas a 1 means it is turned off
 *
 * The mode is determined by the last address position that has been manipulated. So for example if a user
 * writes a word to address 0x60000112 the word is written up until address 0x60000115 which consequently means
 * that the mode will be set to binary control mode.
 *
 * Initially the device is in a "turned off" mode, which means, that the UI will not show any segments as turned on. This
 * changes as soon as the user writes anything to the segments.
 *
 * Furthermore there exists a mapping between address 0x60000110 and 0x60000114 and vice-versa as well as with the address
 * 0x60000111 and 0x60000115 and vice-versa. This means whenever the user writes something to those addresses, the
 * content will me mapped automatically to the corresponding other address position.
 *
 * Finally it is not possible the exceed the address range of the seven segment display. So if a word is written
 * to 0x60000114 the top halfword of the word is ignored and the memory at address 0x60000116 and 0x60000117 is
 * not affected.
 */
export class SevenSegmentDevice extends Device {
  public startAddress = Word.fromUnsignedInteger(0x60000110)
  public endAddress = Word.fromUnsignedInteger(0x60000115)
  public isReadOnly = false
  public isVolatile = true

  private static readonly SEG_MODE_ADDRESS_2 =
    Word.fromUnsignedInteger(0x60000111)
  private static readonly BIN_MODE_START_ADDRESS =
    Word.fromUnsignedInteger(0x60000114)
  private static readonly BIN_MODE_END_ADDRESS =
    Word.fromUnsignedInteger(0x60000115)
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

  private isBinaryMode: boolean
  private isOn: boolean

  constructor() {
    super()
    this.writeWord(this.startAddress, Word.fromUnsignedInteger(0xffffffff))
    this.isOn = false
    this.isBinaryMode = false
  }

  /**
   * Returns the array of booleans for the given display number (0-3).
   *
   * @param display display id to get
   * @returns array with eight booleans that indicate if the segment should be on or off
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

  public writeByte(address: Word, byte: Byte): void {
    if (address.toUnsignedInteger() > this.endAddress.toUnsignedInteger()) {
      return
    }
    this.isOn = true
    this.setMode(address)

    if (address.toUnsignedInteger() === this.startAddress.toUnsignedInteger()) {
      super.writeByte(SevenSegmentDevice.BIN_MODE_START_ADDRESS, byte)
    }
    if (
      address.toUnsignedInteger() ===
      SevenSegmentDevice.SEG_MODE_ADDRESS_2.toUnsignedInteger()
    ) {
      super.writeByte(SevenSegmentDevice.BIN_MODE_END_ADDRESS, byte)
    }
    if (
      address.toUnsignedInteger() ===
      SevenSegmentDevice.BIN_MODE_START_ADDRESS.toUnsignedInteger()
    ) {
      super.writeByte(this.startAddress, byte)
    }
    if (
      address.toUnsignedInteger() ===
      SevenSegmentDevice.BIN_MODE_END_ADDRESS.toUnsignedInteger()
    ) {
      super.writeByte(SevenSegmentDevice.SEG_MODE_ADDRESS_2, byte)
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

  private getDisplayBinaryMode(display: number): boolean[] {
    let arr: boolean[] | undefined = []

    switch (display) {
      case 0:
        arr = segmentsMap.get(
          this.memory
            .readByte(SevenSegmentDevice.BIN_MODE_START_ADDRESS)
            .toUnsignedInteger() % 16
        )
        break
      case 1:
        arr = segmentsMap.get(
          Math.floor(
            this.memory
              .readByte(SevenSegmentDevice.BIN_MODE_START_ADDRESS)
              .toUnsignedInteger() / 16
          )
        )
        break
      case 2:
        arr = segmentsMap.get(
          this.memory
            .readByte(SevenSegmentDevice.BIN_MODE_END_ADDRESS)
            .toUnsignedInteger() % 16
        )
        break
      case 3:
        arr = segmentsMap.get(
          Math.floor(
            this.memory
              .readByte(SevenSegmentDevice.BIN_MODE_END_ADDRESS)
              .toUnsignedInteger() / 16
          )
        )
        break
    }
    if (arr) {
      return arr
    }
    return []
  }

  private getDisplaySegmentControlMode(display: number): boolean[] {
    let arr: boolean[] = []
    let byte = this.readByte(this.startAddress.add(display))
    for (let i = 0; i < 8; i++) {
      arr[i] = !byte.isBitSet(7 - i)
    }

    return arr
  }

  private setMode(adress: Word): void {
    if (
      adress.toUnsignedInteger() >=
      SevenSegmentDevice.BIN_MODE_START_ADDRESS.toUnsignedInteger()
    ) {
      this.isBinaryMode = true
    } else {
      this.isBinaryMode = false
    }
  }
}
