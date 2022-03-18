import { IMemory } from 'board/memory/interfaces'
import { Registers, Register } from 'board/registers'
import { IInstructionSet } from 'instruction/interfaces'
import { Word } from 'types/binary/word'
import { Halfword } from 'types/binary'

const cycleSpeed: number = 1000

const flashStartAddress: Word = Word.fromUnsignedInteger(0x08000000)

/**
 * The processor is responsible for the actual execcution of the program that is currently stored to flash memory.
 * @author Leo Rudin
 */
export class Processor {
  private readonly registers: Registers
  private readonly memory: IMemory
  private readonly instructions: IInstructionSet

  private interval: number = 0
  private isRunning: boolean = false

  constructor (registers: Registers, memory: IMemory, instructions: IInstructionSet) {
    this.registers = registers
    this.memory = memory
    this.instructions = instructions
  }

  /**
   * Executes the program that is currently saved to the flash part of memory. Only callable
   * if program is not already running.
   * @returns void
   */
  public execute (): void {
    if (this.isRunning) {
      return
    }

    this.interval = window.setInterval(this.cycle, cycleSpeed)
    this.isRunning = true
  }

  /**
   * Halts the execution but does not reset registers. This function is only callable
   * if the code is currently running.
   * @returns void
   */
  public halt (): void {
    if (!this.isRunning) {
      return
    }

    this.isRunning = false
  }

  /**
   * Resets the whole processor state and starts the program back at the beginning. This
   * method is not callable until the program execution is halted.
   * @returns void
   */
  public reset (): void {
    if (this.isRunning) {
      return
    }

    window.clearInterval(this.interval)

    this.memory.clear()
    this.registers.clear()

    this.registers.writeRegister(Register.PC, flashStartAddress)
    this.registers.writeRegister(Register.SP, Word.fromUnsignedInteger(0))
  }

  private cycle (): void {
    if (this.isRunning) {
      const pc: Word = this.registers.readRegister(Register.PC)
      const opCode: Halfword = this.memory.readHalfword(this.registers.readRegister(Register.PC))
      this.instructions.getExecutor(opCode).executeInstruction(opCode, this.registers, this.memory)
      this.registers.writeRegister(Register.PC, pc.increment(2))
    }
  }
}
