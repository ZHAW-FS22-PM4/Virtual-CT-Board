import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { IInstruction, ILabelOffsets } from 'instruction/interfaces'
import { Halfword } from 'types/binary'

export abstract class BaseInstruction implements IInstruction {
  abstract name: string
  abstract pattern: string
  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    return this.name === commandName
  }
  public abstract executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void

  public abstract encodeInstruction(
    options: string[],
    labels: ILabelOffsets
  ): Halfword
}
