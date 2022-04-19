import { Device } from 'board/devices/device'
import { Byte, Word } from '../../../types/binary'


export class SEVENseg extends Device {
  public startAddress = Word.fromUnsignedInteger(0x60000114)
  public endAddress = Word.fromUnsignedInteger(0x60000105)
  public isReadOnly = false
  public isVolatile = false

  private static readonly MAX_SEG_DATA: number = 31

  /**
   * Returns true if seg with given data is shown.
   *
   * @param data seg binary data to check (0-31)
   * @returns true if led is turned on
   */
  public isOn(data: number): boolean {
    if (SEVENseg.invalidData(data)) {
      throw new Error(`Position ${data} does not exist.`)
    }
    return this.findSegByte(data).isBitSet(data % 8)
  }

  private findSegByte(position: number): Byte {
    return this.memory.readByte(this.startAddress.add(Math.floor(position / 8)))
  }

  private static invalidData(data: number): boolean {
    return data < 0 || data > SEVENseg.MAX_SEG_DATA
  }
}
