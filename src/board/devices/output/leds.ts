import { Byte, Word } from 'types/binary'
import { Device } from 'board/devices/device'

export class LEDs extends Device {
  public startAddress = Word.fromUnsignedInteger(0x08000000)
  public endAddress = Word.fromUnsignedInteger(0x081fffff)
  public isReadOnly = false
  public isVolatile = false

  private static readonly MAX_LED_NUMBER: number = 31

  /**
   * Returns true if switch with given position is switched on.
   *
   * @param position switch position to check (0-31)
   * @returns true if switch is turned on
   */
  public isOn(position: number): boolean {
    if (this.invalidPosition(position)) {
      throw new Error(`Position ${position} does not exist.`)
    }
    return this.findLedByte(position).isBitSet(position % 8)
  }

  private findLedByte(position: number): Byte {
    return this.memory.readByte(this.startAddress.add(position))
  }

  private invalidPosition(position: number): boolean {
    return position < 0 || position > LEDs.MAX_LED_NUMBER
  }

}
