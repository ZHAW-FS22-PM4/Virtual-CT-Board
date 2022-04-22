import { Device } from 'board/devices/device'
import { Halfword, Word } from 'types/binary'

export class LcdDisplay extends Device {
  private static readonly MAX_LCD_TEXT_NUMBER: number = 39

  private static readonly LCD_ASCII_ADRESS_LIST: Word[] = this.createAdressList(
    0x60000300,
    0x60000327
  )
  private static readonly LCD_BINARY_ADRESS_LIST: Word[] =
    this.createAdressList(0x60000330, 0x6000033f)
  private static readonly LCD_COLOUR_ADRESS_LIST: Word[] =
    this.createAdressList(0x60000340, 0x60000345)

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
    let t: String = String.fromCharCode(2)
    return String.fromCharCode(
      this.memory
        .readByte(LcdDisplay.LCD_ASCII_ADRESS_LIST[position])
        .toUnsignedInteger()
    )
  }

  /**
   * Returns the actual set colour of the lcd screen
   *
   * @returns an array of halfwords with the rgb values in the order red, green, blue
   */
  public getColour(): Halfword[] {
    let colour: Halfword[] = []
    for (let i = 0; i < LcdDisplay.LCD_COLOUR_ADRESS_LIST.length; i += 2) {
      colour[i] = this.memory.readHalfword(LcdDisplay.LCD_COLOUR_ADRESS_LIST[i])
    }
    return colour
  }

  private static createAdressList(start: number, end: number): Word[] {
    let adresslist: Word[] = []
    for (let i = 0; i <= end - start; i++) {
      adresslist[i] = Word.fromUnsignedInteger(start + i)
    }
    return adresslist
  }

  private invalidPosition(position: number): boolean {
    return position < 0 || position > LcdDisplay.MAX_LCD_TEXT_NUMBER
  }
}
