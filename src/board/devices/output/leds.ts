import { Word } from 'types/binary'
import { Device } from 'board/devices/device'

export class LEDs extends Device {
  public startAddress = Word.fromUnsignedInteger(0x08000000)
  public endAddress = Word.fromUnsignedInteger(0x081FFFFF)
  public isReadOnly = false
  public isVolatile = false

  public isOn (position: number): boolean {
    throw new Error('Device not yet implemented.')
  }
}
