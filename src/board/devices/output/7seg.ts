import { Device } from 'board/devices/device'
import { Byte, Halfword, Word } from '../../../types/binary'
enum SEVENsegNr {
  _0011_1111 = 0,
  _0000_0110 = 1,
  _0101_1011 = 2,
  _0100_1111 = 3,
  _0110_0110 = 4,
  _0110_1101 = 5,
  _0111_1101 = 6,
  _0000_0111 = 7,
  _0111_1111 = 8,
  _0110_1111 = 9,
  _0111_0111 = 10, //a
  _0111_1100 = 11, //b
  _0100_1100 = 12, //c
  _0101_1110 = 13, //d
  _0111_1001 = 14, //e
  _0111_0001 = 15 //f
}

export class SEVENseg extends Device {
  public startAddress = Word.fromUnsignedInteger(0x60000110)
  public endAddress = Word.fromUnsignedInteger(0x60000115)
  public startAddressBin = Word.fromUnsignedInteger(0x60000114)
  public endAddressBin = Word.fromUnsignedInteger(0x60000115)
  public isReadOnly = false
  public isVolatile = true

  private static readonly MAX_SEG_NUMBER: number = 31
  private oldBin: Halfword = this.memory.readHalfword(this.startAddressBin)
  private oldSeg: Word = this.memory.readWord(this.startAddress)
  private displays: boolean[][] = [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false]
  ]
  /**
   * Returns true if seg with given position is on.
   *
   * @param position seg position to check (0-31)
   * @param segment segmentnumber to check (0-3)
   * @returns true if segment is turned on
   */
  public isOn(segment: number, position: number): boolean {
    if (SEVENseg.invalidPosition(segment, position)) {
      throw new Error(`Segment ${segment} Position ${position} does not exist.`)
    }
    return this.displays[segment][position]
  }

  /**
   * Returns an array of segment positions,true if seg on position should be on.
   * the values are read from the newer updated datasection and interpreted accordingly
   *
   * @param display display to get (0-3)
   * @returns segmentArray an array of boolean, true if segment is turned on
   */
  public getDisplay(display: number): boolean[] {
    if (this.isBin()) {
      this.displays[display] = this.getBinDisplay(display)
    }
    if (this.isReg()) {
      this.displays[display] = this.getRegDisplay(display)
    }
    return this.displays[display]
  }
  /**
   * Returns true if value where the binary section is stored has changed.
   *
   * @returns true in case of change
   */
  private isBin(): boolean {
    return (
      this.memory.readHalfword(this.startAddressBin).toUnsignedInteger() !=
      this.oldBin.toUnsignedInteger()
    )
  }
  /**
   * Returns true if value where the regular section is stored has changed.
   *
   * @returns true in case of change
   */
  private isReg(): boolean {
    return (
      this.memory.readWord(this.startAddress).toUnsignedInteger() !=
      this.oldSeg.toUnsignedInteger()
    )
  }
  /**
   * converts an number to an array of segment positions,true if seg on position should be on.
   *
   * @param inNum number to convert (0-15)
   * @returns segmentArray an array of boolean, true if segment is turned on
   */
  private toSevensegNrBin(inNum: number): boolean[] {
    let arr: boolean[] = []

    let code: String = SEVENsegNr[inNum]
    for (let i = 0; i < code.length; i++) {
      const character = code.charAt(i)
      if (character == '0') {
        arr.push(false)
      }
      if (character == '1') {
        arr.push(true)
      }
      if (character == '_') {
      }
    }

    return arr
  }

  /**
   * Returns an array of segment positions,true if seg on position should be on.
   * the values are read from the datasection and interpreted binary
   *
   * @param display to check (0-3)
   * @returns segmentArray an array of boolean, true if segment is turned on
   */
  private getBinDisplay(display: number): boolean[] {
    let arr: boolean[] = []
    switch (display) {
      case 0:
        arr = this.toSevensegNrBin(
          this.memory.readByte(this.startAddressBin).toUnsignedInteger() % 16
        )
        this.oldBin = this.memory.readHalfword(this.startAddressBin)
        break
      case 1:
        arr = this.toSevensegNrBin(
          ~~(
            this.memory.readByte(this.startAddressBin).toUnsignedInteger() / 16
          )
        )
        break
      case 2:
        arr = this.toSevensegNrBin(
          this.memory.readByte(this.endAddressBin).toUnsignedInteger() % 16
        )
        break
      case 3:
        arr = this.toSevensegNrBin(
          ~~(this.memory.readByte(this.endAddressBin).toUnsignedInteger() / 16)
        )
        break
      default:
        //
        break
    }

    return arr
  }

  /**
   * converts an number to an array of segment positions,true if seg on position should be on.
   *
   * @param inByte byte to convert (0-F)
   * @returns segmentArray an array of boolean, true if segment is turned on
   */
  private toSevensegNr(inByte: Byte): boolean[] {
    let arr: boolean[] = []
    let code: String = inByte.toBinaryString()
    for (let i = 0; i < code.length; i++) {
      const character = code.charAt(i)
      if (character == '0') {
        arr.push(false)
      }
      if (character == '1') {
        arr.push(true)
      }
    }

    return arr
  }

  /**
   * Returns an array of segment positions,true if seg on position should be on.
   * the values are read from the datasection and interpreted hexadecimal
   *
   * @param display to check (0-3)
   * @returns segmentArray an array of boolean, true if segment is turned on
   */
  private getRegDisplay(display: number): boolean[] {
    let arr: boolean[] = []
    arr = this.toSevensegNr(
      this.memory.readByte(this.startAddress.add(display))
    )
    if (display == 0) {
      this.oldSeg = this.memory.readWord(this.startAddress)
    }
    return arr
  }

  private static invalidPosition(segment: number, position: number): boolean {
    return (
      position < 0 ||
      position > SEVENseg.MAX_SEG_NUMBER ||
      segment < 0 ||
      segment > 7
    )
  }
}
