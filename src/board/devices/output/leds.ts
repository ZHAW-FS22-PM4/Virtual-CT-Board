import { Device } from 'board/devices/device'
import { Byte, Word } from 'types/binary'

export class LedsDevice extends Device {
  public startAddress = Word.fromUnsignedInteger(0x60000100)
  public endAddress = Word.fromUnsignedInteger(0x60000103)
  public isReadOnly = false
  public isVolatile = true

  private static readonly MAX_LED_NUMBER: number = 31

  /**
   * Returns true if led with given position is on.
   *
   * @param position led position to check (0-31)
   * @returns true if led is turned on
   */
  public isOn(position: number): boolean {
    if (LedsDevice.invalidPosition(position)) {
      throw new Error(`Position ${position} does not exist.`)
    }
    return this.findLedByte(position).isBitSet(position % 8)
  }

  private findLedByte(position: number): Byte {
    return this.memory.readByte(this.startAddress.add(Math.floor(position / 8)))
  }

  private static invalidPosition(position: number): boolean {
    return position < 0 || position > LedsDevice.MAX_LED_NUMBER
  }
}
