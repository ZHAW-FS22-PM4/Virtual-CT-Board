import { Halfword } from 'types/binary'
import { Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'
import { ILabelOffsets, IInstruction } from '../interfaces'

/**
 * Represents a 'MOV' instruction.
 */
export class MovInstruction implements IInstruction {
  public name: string = 'MOV'
  public pattern: string = '01000110XXXXXXXX'

  public encodeInstruction (options: string[], labels: ILabelOffsets): Halfword {
    throw new Error('Instruction not yet implemented.')
  }

  public executeInstruction (opcode: Halfword, registers: Registers, memory: IMemory): void {
    throw new Error('Instruction not yet implemented.')
  }
}
