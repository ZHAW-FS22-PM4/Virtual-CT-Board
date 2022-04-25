import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
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

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    this.onExecuteInstruction(opcode, registers, memory)
    this.onIncrementProgramCounter(opcode, registers, memory)
  }

  protected onExecuteInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {}

  protected onIncrementProgramCounter(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    const pc = registers.readRegister(Register.PC)
    registers.writeRegister(Register.PC, pc.add(2))
  }
}
