import { Byte, Word } from 'types/binary'
import { Device } from 'board/devices/device'

/**
 * Represents switches I/O in memory.
 *
 * @author Leo Rudin
 */
export class Switches extends Device {
  private static readonly blockAddressList: Word[] = [
    Word.fromUnsignedInteger(0x60000200),
    Word.fromUnsignedInteger(0x60000201),
    Word.fromUnsignedInteger(0x60000202),
    Word.fromUnsignedInteger(0x60000203)
  ]

  private static readonly MAX_SWITCH_NUMBER: number = 31

  public startAddress = Switches.blockAddressList[0]
  public endAddress = Switches.blockAddressList[3]
  public isReadOnly = false
  public isVolatile = false

  /**
   * Returns true if switch with given position is switched on.
   *
   * @param position switch position to check (0-31)
   * @returns true if switch is turned on
   */
  public isOn(position: number): boolean {
    if (this.invalidPosition(position)) {
      throw new Error(`Position ${position} does not exist.`)
    }

    return this.findSwitchByte(position).isBitSet(position % 8)
  }

  /**
   * Toggles the switch with the given position.
   *
   * @param position switch position to toggle (0-31)
   */
  public toggle(position: number): void {
    if (this.invalidPosition(position)) {
      throw new Error(`Position ${position} does not exist.`)
    }

    this.findSwitchByte(position).toggleBit(position % 8)
  }

  /**
   * Sets the switch at the given position to the given value.
   *
   * @param position switch position to set value to (0-31)
   * @param isOn value to set the switch to
   */
  public set(position: number, isOn: boolean): void {
    if (this.invalidPosition(position)) {
      throw new Error(`Position ${position} does not exist.`)
    }

    if (isOn) {
      this.findSwitchByte(position).setBit(position % 8)
    } else {
      this.findSwitchByte(position).clearBit(position % 8)
    }
  }

  private invalidPosition(position: number): boolean {
    return position < 0 || position > Switches.MAX_SWITCH_NUMBER
  }

  private findSwitchByte(position: number): Byte {
    return this.readByte(Switches.blockAddressList[Math.floor(position / 8)])
  }
}
