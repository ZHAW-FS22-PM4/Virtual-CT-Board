import { Device } from 'board/devices/device'
import { Word } from '../../../types/binary'


export class SEVENseg extends Device {
  public startAddress = Word.fromUnsignedInteger(0x60000114)
  public endAddress = Word.fromUnsignedInteger(0x60001105)
  public isReadOnly = false
  public isVolatile = false

  public isOn(position: number): boolean {
    throw new Error('Device not yet implemented.')
  }
}
