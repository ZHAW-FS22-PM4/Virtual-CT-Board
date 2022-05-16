/**
 * Represents the hex switch in memory.
 *
 * @author Philippe Schneider
 */

import { Device } from 'board/devices/device'
import { Byte, Word } from 'types/binary'

export class HexSwitchDevice extends Device {
  private static readonly HEXSWITCH_ADDRESS: Word =
    Word.fromUnsignedInteger(0x60000211)
  private static readonly MINVALUE = 240
  private static readonly MAXVALUE = 255

  public isReadOnly = false
  public isVolatile = false
  public startAddress = HexSwitchDevice.HEXSWITCH_ADDRESS
  public endAddress = HexSwitchDevice.HEXSWITCH_ADDRESS

  constructor() {
    super()
    this.initializeByte()
  }

  /**
   * Increases the hex switch.
   */
  public increase(): void {
    let hexSwitchByte = this.memory.readByte(HexSwitchDevice.HEXSWITCH_ADDRESS)
    if (hexSwitchByte.value < HexSwitchDevice.MAXVALUE) {
      this.memory.writeByte(
        HexSwitchDevice.HEXSWITCH_ADDRESS,
        hexSwitchByte.add(1)
      )
    }
  }

  /**
   * Decreases the hex switch.
   */
  public decrease(): void {
    let hexSwitchByte = this.memory.readByte(HexSwitchDevice.HEXSWITCH_ADDRESS)
    if (hexSwitchByte.value > HexSwitchDevice.MINVALUE) {
      this.memory.writeByte(
        HexSwitchDevice.HEXSWITCH_ADDRESS,
        hexSwitchByte.add(-1)
      )
    }
  }

  /**
   * Returns the current value of the hex switch.
   *
   * @returns: the current value of the hex switch
   */
  public getHexValue(): number {
    return this.memory.readByte(HexSwitchDevice.HEXSWITCH_ADDRESS).value - 240
  }

  /**
   * Initializes the correct bits at the address for the hex switch
   *
   */
  private initializeByte(): void {
    this.memory.writeByte(
      HexSwitchDevice.HEXSWITCH_ADDRESS,
      Byte.fromUnsignedInteger(240)
    )
  }
}
