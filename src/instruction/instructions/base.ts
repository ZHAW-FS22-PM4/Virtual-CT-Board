import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { IInstruction } from 'instruction/interfaces'
import { Halfword } from 'types/binary'

export abstract class BaseInstruction implements IInstruction {
  public abstract name: string
  public abstract pattern: string
  public opcodeLength: number = 1
  public needsLabels: boolean = false

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return this.name === name
  }

  public abstract encodeInstruction(options: string[]): Halfword[]

  public executeInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    if (opcode.length != this.opcodeLength) {
      throw new Error('Invalid opcode length.')
    }
    this.onExecuteInstruction(opcode, registers, memory)
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {}
}
