import { Word } from 'types/binary'

export enum Register {
  R0 = 0,
  R1 = 1,
  R2 = 2,
  R3 = 3,
  R4 = 4,
  R5 = 5,
  R6 = 6,
  R7 = 7,
  R8 = 8,
  R9 = 9,
  R10 = 10,
  R11 = 11,
  R12 = 12,
  SP = 13,
  LR = 14,
  PC = 15
}

interface IRegisterData {
  [register: number]: number
}

export class Registers {
  private data: IRegisterData = {}

  constructor () {
    this.data = {}
  }

  public readRegister (register: Register): Word {
    return Word.fromUnsignedInteger(this.data[register])
  }

  public writeRegister (register: Register, word: Word): void {
    this.data[register] = word.value
  }

  public clear (): void {
    this.data = {}
  }
}
