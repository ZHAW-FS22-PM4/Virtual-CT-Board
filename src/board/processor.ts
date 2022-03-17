import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { IInstructionSet } from 'instruction/interfaces'

export class Processor {
  private readonly registers: Registers
  private readonly memory: IMemory
  private readonly instructions: IInstructionSet

  constructor (registers: Registers, memory: IMemory, instructions: IInstructionSet) {
    this.registers = registers
    this.memory = memory
    this.instructions = instructions
  }
}
