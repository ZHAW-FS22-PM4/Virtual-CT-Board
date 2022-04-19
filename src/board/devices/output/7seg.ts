import { Device } from 'board/devices/device'
import { Byte, Word } from '../../../types/binary'


export class SEVENseg extends Device {
  public startAddress = Word.fromUnsignedInteger(0x60000110)
  public endAddress = Word.fromUnsignedInteger(0x60000113)
  public isReadOnly = false
  public isVolatile = false

  private static readonly MAX_SEG_NUMBER: number = 31

  /**
   * Returns true if seg with given position is on.
   *
   * @param position seg position to check (0-31)
   * @returns true if segment is turned on
   */
  public isOn(position: number): boolean {
    if (SEVENseg.invalidPosition(position)) {
      throw new Error(`Position ${position} does not exist.`)
    }
    return this.findSegByte(position).isBitSet(position % 8)
  }

  private findSegByte(position: number): Byte {
    return this.memory.readByte(this.startAddress.add(Math.floor(position / 8)))
  }

  private static invalidPosition(position: number): boolean {
    return position < 0 || position > SEVENseg.MAX_SEG_NUMBER
  }
}
