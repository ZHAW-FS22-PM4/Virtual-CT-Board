import { Word } from 'types/binary'
import { IObjectFile } from 'assembler/objectFile'

import { Device } from './device'

export class Flash extends Device {
  public startAddress = Word.fromUnsignedInteger(0x08000000)
  public endAddress = Word.fromUnsignedInteger(0x081fffff)
  public isReadOnly = false
  public isVolatile = false

  public writeObjectFile(file: IObjectFile): void {}
}
