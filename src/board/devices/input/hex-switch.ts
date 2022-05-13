/**
 * Represents the rotary switch in memory.
 *
 * @author Philippe Schneider
 */

import { Device } from 'board/devices/device'
import { Byte, Word } from 'types/binary'

export class HexSwitchDevice extends Device {
  private static readonly ROTARYSWITCH_ADDRESS: Word =
    Word.fromUnsignedInteger(0x60000211)
  private static readonly MINVALUE = 240
  private static readonly MAXVALUE = 255

  public isReadOnly = false
  public isVolatile = false
  public startAddress = HexSwitchDevice.ROTARYSWITCH_ADDRESS
  public endAddress = HexSwitchDevice.ROTARYSWITCH_ADDRESS

  constructor() {
    super()
    this.initializeByte()
  }

  /**
   * increase the rotary switch
   *
   */
  public increase(): void {
    let rotarySwitchByte = this.memory.readByte(
      HexSwitchDevice.ROTARYSWITCH_ADDRESS
    )
    if (rotarySwitchByte.value < HexSwitchDevice.MAXVALUE) {
      this.memory.writeByte(
        HexSwitchDevice.ROTARYSWITCH_ADDRESS,
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
      HexSwitchDevice.ROTARYSWITCH_ADDRESS
    )
    if (rotarySwitchByte.value > HexSwitchDevice.MINVALUE) {
      this.memory.writeByte(
        HexSwitchDevice.ROTARYSWITCH_ADDRESS,
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
    return (
      this.memory.readByte(HexSwitchDevice.ROTARYSWITCH_ADDRESS).value - 240
    )
  }

  /**
   * Initializes the correct bits at the address for the rotary switch
   *
   */
  private initializeByte(): void {
    this.memory.writeByte(
      HexSwitchDevice.ROTARYSWITCH_ADDRESS,
      Byte.fromUnsignedInteger(240)
    )
  }
}
