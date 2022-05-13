/**
 * Represents the rotary switch in memory.
 *
 * @author Philippe Schneider
 */

import { Device } from 'board/devices/device'
import { Byte, Word } from 'types/binary'

export class RotarySwitch extends Device {
  private static readonly ROTARYSWITCH_ADDRESS: Word =
    Word.fromUnsignedInteger(0x60000211)
  private static readonly MINVALUE = 240
  private static readonly MAXVALUE = 255

  public isReadOnly = false
  public isVolatile = false
  public startAddress = RotarySwitch.ROTARYSWITCH_ADDRESS
  public endAddress = RotarySwitch.ROTARYSWITCH_ADDRESS

  /**
   * increase the rotary switch
   *
   */
  public increase(): void {
    let rotarySwitchByte = this.memory.readByte(
      RotarySwitch.ROTARYSWITCH_ADDRESS
    )
    if (rotarySwitchByte.value < RotarySwitch.MAXVALUE) {
      this.memory.writeByte(
        RotarySwitch.ROTARYSWITCH_ADDRESS,
        rotarySwitchByte.add(1)
      )
    }
  }

  /**
   * decrease the rotary switch
   *
   */
  public decrease(): void {
    let rotarySwitchByte = this.memory.readByte(
      RotarySwitch.ROTARYSWITCH_ADDRESS
    )
    if (rotarySwitchByte.value > RotarySwitch.MINVALUE) {
      this.memory.writeByte(
        RotarySwitch.ROTARYSWITCH_ADDRESS,
        rotarySwitchByte.add(-1)
      )
    }
  }

  /**
   * Returns the current set value of the rotary switch
   *
   * @returns: the current value of the rotary switch
   */
  public getRotaryValue(): number {
    if (
      this.memory.readByte(RotarySwitch.ROTARYSWITCH_ADDRESS).value - 240 <
      0
    ) {
      this.initializeByte()
    }
    return this.memory.readByte(RotarySwitch.ROTARYSWITCH_ADDRESS).value - 240
  }

  private initializeByte(): void {
    this.memory.writeByte(
      RotarySwitch.ROTARYSWITCH_ADDRESS,
      Byte.fromUnsignedInteger(240)
    )
  }
}
