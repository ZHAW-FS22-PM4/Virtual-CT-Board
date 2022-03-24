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

type IRegisterData = {
  [register in Register]: number
}

/**
 * Converts a registers name to its numerical representation
 * @param registerName Registername as string (f.e. 'R8')
 * @returns The numerical representation of the register (f.e. 8)
 */
export function numericalRepresentationFromString(
  registerName: string
): number {
  throw new Error('Function not yet implemented.')
}

/**
 * Represents the registers of the CPU
 */
export class Registers {
  private data: IRegisterData

  constructor() {
    this.data = this.initializeRegisters()
  }

  /**
   * Reads a word from the register
   * @param register register to read
   * @returns read word
   */
  public readRegister(register: Register): Word {
    return Word.fromUnsignedInteger(this.data[register])
  }

  /**
   * Writes a word to a register
   * @param register register to write
   * @param word word to write into the register
   */
  public writeRegister(register: Register, word: Word): void {
    this.data[register] = word.value
  }

  /**
   * Resets all registers to 0
   */
  public clear(): void {
    this.data = this.initializeRegisters()
  }

  /**
   * Resets all registers to 0
   * @returns reset register of type IRegisterData
   */
  private initializeRegisters(): IRegisterData {
    return {
      [Register.R0]: 0x0,
      [Register.R1]: 0x0,
      [Register.R2]: 0x0,
      [Register.R3]: 0x0,
      [Register.R4]: 0x0,
      [Register.R5]: 0x0,
      [Register.R6]: 0x0,
      [Register.R7]: 0x0,
      [Register.R8]: 0x0,
      [Register.R9]: 0x0,
      [Register.R10]: 0x0,
      [Register.R11]: 0x0,
      [Register.R12]: 0x0,
      [Register.SP]: 0x0,
      [Register.LR]: 0x0,
      [Register.PC]: 0x0
    }
  }
}
