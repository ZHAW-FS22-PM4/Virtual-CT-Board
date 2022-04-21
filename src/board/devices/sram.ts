import { Word } from 'types/binary'
import { Device } from './device'

/**
 * Represents the SRAM1, SRAM2 and SRAM3 device of the board.
 */
export class SRAM extends Device {
  public startAddress = Word.fromUnsignedInteger(0x20000000)
  public endAddress = Word.fromUnsignedInteger(0x2002ffff)
  public isReadOnly = true
  public isVolatile = false
}
