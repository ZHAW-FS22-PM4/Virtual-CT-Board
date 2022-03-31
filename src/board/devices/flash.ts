import { Word } from 'types/binary'
import { Device } from './device'

/**
 * Represents the flash device of the board.
 */
export class Flash extends Device {
  public startAddress = Word.fromUnsignedInteger(0x08000000)
  public endAddress = Word.fromUnsignedInteger(0x081fffff)
  public isReadOnly = false
  public isVolatile = false
}
