import { Device } from 'board/devices/device'
import { Word } from 'types/binary'

export class LEDs extends Device {
  public startAddress = Word.fromUnsignedInteger(0x08000000)
  public endAddress = Word.fromUnsignedInteger(0x081fffff)
  public isReadOnly = false
  public isVolatile = false

  public isOn(position: number): boolean {
    throw new Error('Device not yet implemented.')
  }
}
