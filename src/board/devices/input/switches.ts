import { Word } from 'types/binary'
import { Device } from 'board/devices/device'

export class Switches extends Device {
  public startAddress = Word.fromUnsignedInteger(0x08000000)
  public endAddress = Word.fromUnsignedInteger(0x081fffff)
  public isReadOnly = false
  public isVolatile = false

  public isOn(position: number): boolean {
    throw new Error('Device not yet implemented.')
  }

  public toggle(position: number): void {
    throw new Error('Device not yet implemented.')
  }

  public set(position: number, isOn: boolean): void {
    throw new Error('Device not yet implemented.')
  }
}
