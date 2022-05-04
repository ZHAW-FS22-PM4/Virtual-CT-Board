import { Device } from 'board/devices/device'
import { Word } from 'types/binary'

export class RotarySwitch extends Device {
  public RotarySwitch_ADDRESS = Word.fromUnsignedInteger(0x60000211)

  public startAddress = Word.fromUnsignedInteger(0x60000211)
  public endAddress = Word.fromUnsignedInteger(0x60000211)
  public isReadOnly = false
  public isVolatile = false
  private maxValue = 256 //todo: Need to get fixed with correct value

  /**
   * increase the rotary switch
   *
   */
  public increase(): void {
    let newValue = this.RotarySwitch_ADDRESS.value + 1
    if (newValue < this.maxValue) {
      this.memory.writeByte(this.RotarySwitch_ADDRESS, Word.fromUnsignedInteger(newValue))
    }
  }

  /**
   * decrease the rotary switch
   *
   */
  public decrease(): void {
    let newValue = this.RotarySwitch_ADDRESS.value-1
    if (newValue > 0){
      this.memory.writeByte(this.RotarySwitch_ADDRESS, Word.fromUnsignedInteger(newValue))
    }
  }

  /**
   * Returns the current set value of the rotary switch
   *
   * @returns: the current value of the rotary switch
   */
  public getRotaryValue(): number {
    return this.memory.readWord(this.RotarySwitch_ADDRESS).value
  }
}
