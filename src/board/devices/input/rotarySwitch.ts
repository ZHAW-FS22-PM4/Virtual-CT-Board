import { Device } from 'board/devices/device'
import { Word } from 'types/binary'

export class RotarySwitch extends Device {
  public RotarySwitch_ADDRESS = Word.fromUnsignedInteger(0x60000211)

  public startAddress = Word.fromUnsignedInteger(0x60000211)
  public endAddress = Word.fromUnsignedInteger(0x60000211)
  public isReadOnly = false
  public isVolatile = false


  /**
   * increase the rotary switch
   *
   */
  public increase(): void {
    this.memory.writeByte(this.RotarySwitch_ADDRESS, this.RotarySwitch_ADDRESS)
  }


  /**
   * decrease the rotary switch
   *
   */
  public decrease(): void {
    this.memory.writeByte(this.RotarySwitch_ADDRESS, this.RotarySwitch_ADDRESS)
  }
}
