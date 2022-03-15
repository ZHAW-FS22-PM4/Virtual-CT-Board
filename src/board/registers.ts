/*
    Represents the registers of the board's processor
*/

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

type IRegisters = {
  [register in Register]: number;
}

let registers: IRegisters = initializeRegisters()

export function readRegister (register: Register): Word {
  return Word.fromUnsignedInteger(registers[register])
}

export function writeRegister (register: Register, word: Word): void {
  registers[register] = word.value
}

export function clearRegisters (): void {
  registers = initializeRegisters()
}

function initializeRegisters (): IRegisters {
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
