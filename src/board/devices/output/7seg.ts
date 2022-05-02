import { Device } from 'board/devices/device'
import { Byte, Word } from '../../../types/binary'
enum SEVENsegNr {
  _0011_1111 = 0,
  _0000_0110 = 1,
  _0101_1011 = 2,
  _0100_1111 = 3,
  _0110_0110 = 4,
  _0110_1101 = 5,
  _0111_1101 = 6,
  _0000_0111 = 7,
  _0111_1111 = 8,
  _0110_1111 = 9,
  _0111_0111 = 10,//a
  _0111_1100 = 11,//b
  _0100_1100 = 12,//c
  _0101_1110 = 10,//d
  _0111_1001 = 10,//e
  _0111_0011 = 10,//f
}

export class SEVENseg extends Device {
  public startAddress = Word.fromUnsignedInteger(0x60000110)
  public endAddress = Word.fromUnsignedInteger(0x60000113)
  public startAddressBin = Word.fromUnsignedInteger(0x60000114)
  public endAddressBin = Word.fromUnsignedInteger(0x60000105)
  public isReadOnly = false
  public isVolatile = false

  private static readonly MAX_SEG_NUMBER: number = 31
  private oldBin: Word = Word.fromUnsignedInteger(65535)


  /**
   * Returns true if seg with given position is on.
   *
   * @param position seg position to check (0-31)
   * @returns true if segment is turned on
   */
  public isOn(position: number): boolean {
    if (SEVENseg.invalidPosition(position)) {
      throw new Error(`Position ${position} does not exist.`)
    }
    return this.findSegByte(position).isBitSet(position % 8)
  }
  public getDisplay(display: number): boolean[]{
    if( this.isBin()){
     return this.getBinDisplay(display)
    }else{

    }
    return [true,false,true,false,true,true,true,true]
  }
  /**
   * Returns true if seg with given position is on.
   *
   * @returns true if segment is turned on
   */
  private isBin():boolean{
    return (this.memory.readWord(this.startAddressBin)!=this.oldBin)||(this.memory.readWord(this.endAddressBin)!=this.oldBin)
  }

  private toSevensegNr(inByte: Byte):boolean[]{
    return []
  }
  private getBinDisplay(display: number): boolean[]{
    let arr: boolean[] = []
    switch ( display ) {
      case 0:
        arr = this.toSevensegNr(this.memory.readByte(this.startAddressBin))
        break;
      case 1:
        this.memory.readByte(this.startAddressBin)
        break;
      case 2:
        this.memory.readByte(this.endAddressBin)
        break;
      case 3:
        this.memory.readByte(this.endAddressBin)
        break;
      default:
        //
        break;
    }


return arr
  }








  private findSegByte(position: number): Byte {
    return this.memory.readByte(this.startAddress.add(Math.floor(position / 8)))
  }

  private static invalidPosition(position: number): boolean {
    return position < 0 || position > SEVENseg.MAX_SEG_NUMBER
  }
}
