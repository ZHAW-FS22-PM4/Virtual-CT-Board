/**
 * Represents buttons I/O in memory.
 *
 * @author Silvan Nigg
 */
import { Device } from 'board/devices/device'
import { Word } from 'types/binary'

export class ButtonsDevice extends Device {
  private static readonly MAX_BUTTON_NUMBER: number = 3
  private static readonly BUTTONS_ADDRESS: Word =
    Word.fromUnsignedInteger(0x60000210)

  public startAddress = ButtonsDevice.BUTTONS_ADDRESS
  public endAddress = ButtonsDevice.BUTTONS_ADDRESS
  public isReadOnly = true
  public isVolatile = false

  /**
   * Returns true if button with given position is pressed.
   *
   * @param position button position to check (0-3)
   * @returns true if button is pressed
   */
  public isPressed(position: number): boolean {
    if (ButtonsDevice.invalidPosition(position)) {
      throw new Error(`Button position ${position} does not exist.`)
    }

    return this.memory
      .readByte(ButtonsDevice.BUTTONS_ADDRESS)
      .isBitSet(position)
  }

  /**
   * Presses the button at the given position.
   *
   * @param position button position to press (0-3)
   */
  public press(position: number): void {
    if (ButtonsDevice.invalidPosition(position)) {
      throw new Error(`Button position ${position} does not exist.`)
    }

    const updatedByte = this.memory
      .readByte(ButtonsDevice.BUTTONS_ADDRESS)
      .setBit(position)
    this.memory.writeByte(ButtonsDevice.BUTTONS_ADDRESS, updatedByte)
  }

  /**
   * Releases the button at the given position.
   *
   * @param position button position to press (0-3)
   */
  public release(position: number): void {
    if (ButtonsDevice.invalidPosition(position)) {
      throw new Error(`Button position ${position} does not exist.`)
    }

    const updatedByte = this.memory
      .readByte(ButtonsDevice.BUTTONS_ADDRESS)
      .clearBit(position)
    this.memory.writeByte(ButtonsDevice.BUTTONS_ADDRESS, updatedByte)
  }

  private static invalidPosition(position: number): boolean {
    return position < 0 || position > ButtonsDevice.MAX_BUTTON_NUMBER
  }
}
