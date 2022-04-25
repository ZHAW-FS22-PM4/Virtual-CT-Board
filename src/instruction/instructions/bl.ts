import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import { Halfword } from 'types/binary'
import { BaseInstruction } from './base'

export class BInstruction extends BaseInstruction {
  public name: string = 'BL'
  public pattern: string = 'XXXXXXXXXXXXXXXX'

  public encodeInstruction(
    options: string[],
    labels: ILabelOffsets
  ): Halfword[] {
    throw new Error('Method not implemented.')
  }

  protected onIncrementProgramCounter(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    // Increment program counter here.
  }
}
