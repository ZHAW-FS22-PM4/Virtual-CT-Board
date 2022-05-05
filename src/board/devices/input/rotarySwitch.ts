/**
 * Represents the rotary switch in memory.
 *
 * @author Philippe Schneider
 */

import { Device } from 'board/devices/device'
import { Byte, Word } from 'types/binary'

export class RotarySwitch extends Device {
  private RotarySwitch_ADDRESS = Word.fromUnsignedInteger(0x60000211)
  private maxValue = 255
  private minValue = 0

  public isReadOnly = false
  public isVolatile = false
  public startAddress = this.RotarySwitch_ADDRESS
  public endAddress = this.RotarySwitch_ADDRESS

  /**
   * increase the rotary switch
   *
   */
  public increase(): void {
    let newValue = this.memory.readByte(this.RotarySwitch_ADDRESS).value + 1
    if (newValue < this.maxValue) {
      this.memory.writeByte(
        this.RotarySwitch_ADDRESS,
        Byte.fromUnsignedInteger(newValue)
      )
    } else {
      this.memory.writeByte(
        this.RotarySwitch_ADDRESS,
        Byte.fromUnsignedInteger(this.maxValue)
      )
    }
  }

  /**
   * decrease the rotary switch
   *
   */
  public decrease(): void {
    let newValue = this.memory.readByte(this.RotarySwitch_ADDRESS).value - 1
    if (newValue >= this.minValue) {
      this.memory.writeByte(
        this.RotarySwitch_ADDRESS,
        Byte.fromUnsignedInteger(newValue)
      )
    } else {
      this.memory.writeByte(
        this.RotarySwitch_ADDRESS,
        Byte.fromUnsignedInteger(this.minValue)
      )
    }
  }

  /**
   * Returns the current set value of the rotary switch
   *
   * @returns: the current value of the rotary switch
   */
  public getRotaryValue(): Byte {
    return this.memory.readByte(this.RotarySwitch_ADDRESS)
  }
}
