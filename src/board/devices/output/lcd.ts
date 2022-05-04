import { Device } from 'board/devices/device'
import { Byte, Halfword, Word } from 'types/binary'

enum LcdPositionType {
  NotSet = 0,
  Ascii = 1,
  Binary = 2
}

type LcdPositionInfo = {
  [index: number]: LcdPositionType
}

type LcdBinaryFields = {
  [index: number]: [offset: number, bytePosition: number]
}

export class LcdDisplay extends Device {
  private static readonly MAX_LCD_POSITION: number = 39

  private static readonly LCD_ASCII_ADRESS_LIST: Word[] = this.createAdressList(
    0x60000300,
    0x60000327
  )
  private static readonly LCD_BINARY_ADRESS_LIST: Word[] =
    this.createAdressList(0x60000330, 0x6000033f)
  private static readonly LCD_COLOUR_ADRESS_LIST: Word[] =
    this.createAdressList(0x60000340, 0x60000345)

  private static readonly MAX_BINARY_OFFSET: number = 15
  private static readonly EMPTY_POSITIONS_IN_BINARY_MODE: number[] = [
    0, 5, 10, 15, 20, 25, 30, 35
  ]

  // Defines the size of a block on the LCD Screen
  private static readonly BLOCK_SIZE: number = 5

  /*  
    This variable represents the arrangement of the binary display mode.
    The index is the position on the lcd screen.
    The first column (offset) defines, which offset the position belongs to and the second one (bytePosition) shows,
    if the position shows the first or the second char of the byte
  */
  private static readonly LCD_BINARY_FIELD_CONFIGURATION: LcdBinaryFields =
    LcdDisplay.createLcdBinaryFieldConfiguration()

  private lcdPositionInfo: LcdPositionInfo = this.createLcdPositionInfo()

  public startAddress = LcdDisplay.LCD_ASCII_ADRESS_LIST[0]
  public endAddress = LcdDisplay.LCD_COLOUR_ADRESS_LIST[5]
  public isReadOnly = false
  public isVolatile = true

  /**
   * Returns the actual set text of the lcd screen
   *
   * @param position position of the field
   * @returns character at the given position
   */
  public getDisplayValue(position: number): String {
    if (this.invalidPosition(position)) {
      throw new Error(`Position ${position} does not exist.`)
    }
    switch (this.lcdPositionInfo[position]) {
      case LcdPositionType.NotSet: {
        return ''
      }
      case LcdPositionType.Ascii: {
        let val = this.memory.readByte(
          LcdDisplay.LCD_ASCII_ADRESS_LIST[position]
        )
        if (val.value == 0) {
          return ''
        } else {
          return String.fromCharCode(val.toUnsignedInteger())
        }
      }
      case LcdPositionType.Binary: {
        // Check if this position is an empty field (offset = -1)
        if (LcdDisplay.LCD_BINARY_FIELD_CONFIGURATION[position][0] == -1) {
          return ''
        }
        let binaryString: string = this.memory
          .readByte(
            LcdDisplay.LCD_BINARY_ADRESS_LIST[
              LcdDisplay.LCD_BINARY_FIELD_CONFIGURATION[position][0]
            ]
          )
          .toBinaryString()
        if (parseInt(binaryString) == 0) {
          return ''
        }
        // Check if position is the first half of the byte
        let s: string
        if (LcdDisplay.LCD_BINARY_FIELD_CONFIGURATION[position][1] == 1) {
          s = binaryString.substring(0, 4)
        } else {
          s = binaryString.substring(4, 8)
        }
        return parseInt(s, 2).toString(16).toUpperCase()
      }
    }
  }

  /**
   * Returns the actual set colour brightness of the lcd screen
   *
   * @returns an array of halfwords with the colour brightness values in the order red, green, blue
   */
  public getColour(): Halfword[] {
    let colour: Halfword[] = []
    for (let i = 0; i < LcdDisplay.LCD_COLOUR_ADRESS_LIST.length; i += 2) {
      colour[i / 2] = this.memory.readHalfword(
        LcdDisplay.LCD_COLOUR_ADRESS_LIST[i]
      )
    }
    return colour
  }

  /**
   * Returns the actual set colour brightness of the lcd screen in hex value
   *
   * @returns an string of hex color code to use in css
   */
  public getColourHex(): string {
    let colourHex = '#'
    const colours = this.getColour()
    for (let col of colours) {
      colourHex += col.toHexString().substring(2)
    }
    return colourHex
  }

  public writeByte(address: Word, byte: Byte): void {
    super.writeByte(address, byte)
    this.writeAtPosition(address)
  }

  public writeBytes(address: Word, bytes: Byte[]): void {
    super.writeBytes(address, bytes)
    for (let i = 0; i < bytes.length; i++) {
      this.writeAtPosition(address.add(i))
    }
  }

  public writeHalfword(address: Word, halfword: Halfword): void {
    super.writeHalfword(address, halfword)
    this.writeAtPosition(address)
    this.writeAtPosition(address.add(1))
  }

  public writeWord(address: Word, word: Word): void {
    super.writeWord(address, word)
    for (let i = 0; i < 4; i++) {
      this.writeAtPosition(address.add(i))
    }
  }

  private writeAtPosition(address: Word): void {
    for (let i = 0; i < LcdDisplay.LCD_ASCII_ADRESS_LIST.length; i++) {
      if (LcdDisplay.LCD_ASCII_ADRESS_LIST[i].value == address.value) {
        this.setLcdPositionInfoBlock(i, LcdPositionType.Ascii)
        return
      }
    }
    for (let i = 0; i < LcdDisplay.LCD_BINARY_ADRESS_LIST.length; i++) {
      if (LcdDisplay.LCD_BINARY_ADRESS_LIST[i].value == address.value) {
        this.setLcdPositionInfoBlock(
          this.getPositionFromBinaryOffset(i),
          LcdPositionType.Binary
        )
        return
      }
    }
  }

  private getPositionFromBinaryOffset(offset: number): number {
    for (let i = 0; i <= LcdDisplay.MAX_LCD_POSITION; i++) {
      if (LcdDisplay.LCD_BINARY_FIELD_CONFIGURATION[i][0] == offset) {
        return i
      }
    }
    throw new Error('Binary Offset not found.')
  }

  private setLcdPositionInfoBlock(
    position: number,
    type: LcdPositionType
  ): void {
    if (
      position < Math.min.apply(Math, LcdDisplay.EMPTY_POSITIONS_IN_BINARY_MODE)
    ) {
      throw new Error(
        `Position ${position} is lower then the lowest empty position.`
      )
    }
    let lowestPositionOfBlock = position
    while (
      !LcdDisplay.EMPTY_POSITIONS_IN_BINARY_MODE.includes(lowestPositionOfBlock)
    ) {
      lowestPositionOfBlock--
    }
    for (
      let i = lowestPositionOfBlock;
      i < lowestPositionOfBlock + LcdDisplay.BLOCK_SIZE;
      i++
    ) {
      this.lcdPositionInfo[i] = type
    }
  }

  private static createAdressList(start: number, end: number): Word[] {
    let adresslist: Word[] = []
    for (let i = 0; i <= end - start; i++) {
      adresslist[i] = Word.fromUnsignedInteger(start + i)
    }
    return adresslist
  }

  private static createLcdBinaryFieldConfiguration(): LcdBinaryFields {
    let fields: LcdBinaryFields = []
    let nextBytePosition: number = 1
    let nextOffset: number = LcdDisplay.MAX_BINARY_OFFSET

    for (let i = 0; i <= LcdDisplay.MAX_LCD_POSITION; i++) {
      if (LcdDisplay.EMPTY_POSITIONS_IN_BINARY_MODE.includes(i)) {
        fields[i] = [-1, -1]
      } else {
        fields[i] = [nextOffset, nextBytePosition]
        if (nextBytePosition == 1) {
          nextBytePosition--
        } else {
          nextBytePosition++
          nextOffset--
        }
      }
    }
    return fields
  }

  private invalidPosition(position: number): boolean {
    return position < 0 || position > LcdDisplay.MAX_LCD_POSITION
  }

  private createLcdPositionInfo(): LcdPositionInfo {
    let lcdPos: LcdPositionInfo = []
    for (let i = 0; i <= LcdDisplay.MAX_LCD_POSITION; i++) {
      lcdPos[i] = LcdPositionType.NotSet
    }
    return lcdPos
  }
}
