import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { IInstruction, ILabelOffsets } from 'instruction/interfaces'
import { Halfword } from 'types/binary'

export abstract class BaseInstruction implements IInstruction {
  public abstract name: string
  public abstract pattern: string

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return this.name === name
  }

  public abstract encodeInstruction(
    options: string[],
    labels: ILabelOffsets
  ): Halfword

  public abstract executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void
}
