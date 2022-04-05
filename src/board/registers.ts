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
  PC = 15,
  APSR = 99
}

export type IFlag = {
  [flag in Flag]?: boolean
}

export enum Flag {
  N = 'N',
  Z = 'Z',
  C = 'C',
  V = 'V'
}

type IRegisterData = {
  [register in Register]: Word
}

/**
 * Represents the registers of the CPU
 */
export class Registers {
  private data: IRegisterData
  public static lowRegisters: Register[] = [
    Register.R0,
    Register.R1,
    Register.R2,
    Register.R3,
    Register.R4,
    Register.R5,
    Register.R6,
    Register.R7
  ]

  constructor() {
    this.data = this.initializeRegisters()
  }

  /**
   * Reads a word from the register
   * @param register register to read
   * @returns read word
   */
  public readRegister(register: Register): Word {
    return this.data[register]
  }

  /**
   * Writes a word to a register
   * @param register register to write
   * @param word word to write into the register
   */
  public writeRegister(register: Register, word: Word): void {
    this.data[register] = word
  }

  /**
   * checks wheter the desired flag is set or not
   * @param flag Flag to read
   * @returns true if flag is set
   */
  public isFlagSet(flag: Flag): boolean {
    let bitOffset = this.getFlagOffsetWithinAPSR(flag)
    return this.data[Register.APSR].isBitSet(bitOffset)
  }

  /**
   * change bit value of specific flag
   * @param flag flag to change
   * @param setBit with true set to 1 otherwise 0
   */
  public setFlag(flag: Flag, setBit: boolean) {
    let offset = this.getFlagOffsetWithinAPSR(flag)
    this.data[Register.APSR] = setBit
      ? this.data[Register.APSR].setBit(offset)
      : this.data[Register.APSR].clearBit(offset)
  }

  /**
   * Sets the flags that are available in the given list of flags. The other flags are not changed.
   *
   * @param flags flags to set
   */
  public setFlags(flags: IFlag): void {
    if (Flag.Z in flags) this.setFlag(Flag.Z, flags[Flag.Z] === true)
    if (Flag.N in flags) this.setFlag(Flag.N, flags[Flag.N] === true)
    if (Flag.V in flags) this.setFlag(Flag.V, flags[Flag.V] === true)
    if (Flag.C in flags) this.setFlag(Flag.C, flags[Flag.C] === true)
  }

  /**
   * determines offset from rightside in APSR register for desired flag
   * @param flag desired flag
   * @returns offset 0-indexed
   */
  private getFlagOffsetWithinAPSR(flag: Flag): number {
    switch (flag) {
      case Flag.N:
        return 31
      case Flag.Z:
        return 30
      case Flag.C:
        return 29
      case Flag.V:
        return 28
    }
  }

  /**
   * Convenience method to check wheter Register counts as low register or not
   * @param register register to check
   * @returns true if its a low register
   */
  public static isLowRegister(register: Register): boolean {
    return Registers.lowRegisters.includes(register)
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
      [Register.R0]: Word.fromUnsignedInteger(0),
      [Register.R1]: Word.fromUnsignedInteger(0),
      [Register.R2]: Word.fromUnsignedInteger(0),
      [Register.R3]: Word.fromUnsignedInteger(0),
      [Register.R4]: Word.fromUnsignedInteger(0),
      [Register.R5]: Word.fromUnsignedInteger(0),
      [Register.R6]: Word.fromUnsignedInteger(0),
      [Register.R7]: Word.fromUnsignedInteger(0),
      [Register.R8]: Word.fromUnsignedInteger(0),
      [Register.R9]: Word.fromUnsignedInteger(0),
      [Register.R10]: Word.fromUnsignedInteger(0),
      [Register.R11]: Word.fromUnsignedInteger(0),
      [Register.R12]: Word.fromUnsignedInteger(0),
      [Register.SP]: Word.fromUnsignedInteger(0),
      [Register.LR]: Word.fromUnsignedInteger(0),
      [Register.PC]: Word.fromUnsignedInteger(0),
      [Register.APSR]: Word.fromUnsignedInteger(0)
    }
  }
}
