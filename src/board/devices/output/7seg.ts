import { Device } from 'board/devices/device'
import { Byte, Halfword, Word } from '../../../types/binary'
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
  _0101_1110 = 13,//d
  _0111_1001 = 14,//e
  _0111_0001 = 15,//f
}

export class SEVENseg extends Device {
  public startAddress = Word.fromUnsignedInteger(0x60000110)
  public endAddress = Word.fromUnsignedInteger(0x60000115)
  public startAddressBin = Word.fromUnsignedInteger(0x60000114)
  public endAddressBin = Word.fromUnsignedInteger(0x60000115)
  public isReadOnly = false
  public isVolatile = false

  private static readonly MAX_SEG_NUMBER: number = 31
  private oldBin: Halfword = this.memory.readHalfword(this.startAddressBin)
  private oldSeg: Word = this.memory.readWord(this.startAddress)
  private displays: boolean[][] = []
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
    //return [true,true,true,false,true,true,true,true]
    if( this.isBin()){
      this.displays[display]=this.getBinDisplay(display)
    }
    if(this.isReg()){
      this.displays[display]= this.getRegDisplay(display)
    }
    return this.displays[display]
  }
  /**
   * Returns true if value where the binary section is stored has changed.
   *
   * @returns true in case of change
   */
  private isBin():boolean{
    return (this.memory.readHalfword(this.startAddressBin)!=this.oldBin)
  }
  /**
   * Returns true if value where the regular section is stored has changed.
   *
   * @returns true in case of change
   */
  private isReg():boolean{
    return (this.memory.readWord(this.startAddress)!=this.oldSeg)
  }
  private toSevensegNrBin(inNum: number):boolean[]{

    let arr: boolean[] = []

   let code: String = SEVENsegNr[inNum]
    for (let i = 0; i < code.length; i++) {
      const character = code.charAt(i);
      if (character=='0'){arr.push(false)}
      if (character=='1'){arr.push(true)}
      if (character=='_'){}
    }

    return arr
  }
  private getBinDisplay(display: number): boolean[]{
    let arr: boolean[] = []
    switch ( display ) {
      case 0:
        arr = this.toSevensegNrBin(this.memory.readByte(this.startAddressBin).toUnsignedInteger()%16)
        break;
      case 1:
        arr = this.toSevensegNrBin(~~(this.memory.readByte(this.startAddressBin).toUnsignedInteger()/16))
        break;
      case 2:
        arr = this.toSevensegNrBin(this.memory.readByte(this.endAddressBin).toUnsignedInteger()%16)
        break;
      case 3:
        arr = this.toSevensegNrBin(~~(this.memory.readByte(this.endAddressBin).toUnsignedInteger()/16))
        this.oldBin = this.memory.readHalfword(this.startAddressBin)
        break;
      default:
        //
        break;
    }

return arr
  }
  private toSevensegNr(inByte: Byte):boolean[]{

    let arr: boolean[] = []
    let code: String = inByte.toBinaryString()
    for (let i = 0; i < code.length; i++) {
      const character = code.charAt(i);
      if (character=='0'){arr.push(false)}
      if (character=='1'){arr.push(true)}
    }

    return arr
  }
  private getRegDisplay(display: number): boolean[]{
    let arr: boolean[] = []
    arr = this.toSevensegNr(this.memory.readByte(this.startAddress.add(display)))
    if (display==3){this.oldSeg =this.memory.readWord(this.startAddress)}
    return arr
  }


  private findSegByte(position: number): Byte {
    return this.memory.readByte(this.startAddress.add(Math.floor(position / 8)))
  }

  private static invalidPosition(position: number): boolean {
    return position < 0 || position > SEVENseg.MAX_SEG_NUMBER
  }
}
