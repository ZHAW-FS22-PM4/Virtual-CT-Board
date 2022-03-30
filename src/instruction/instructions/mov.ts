import { Halfword, Word } from 'types/binary'
import { Register, Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'

import { ILabelOffsets, IInstruction } from '../interfaces'

/**
 * Represents a 'MOV' instruction.
 */
export class MovInstruction implements IInstruction {
  public name: string = 'MOVS'
  public pattern: string = '01000110XXXXXXXX'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    return Halfword.fromUnsignedInteger(0b0100011000000000)
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0x77))
    registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x44))
  }
}
