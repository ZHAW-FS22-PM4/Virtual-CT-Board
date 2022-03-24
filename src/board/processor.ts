import { Halfword, Word } from 'types/binary'
import { EventEmitter } from 'types/events/emitter'
import { IMemory } from 'board/memory/interfaces'
import { Registers, Register } from 'board/registers'
import { IInstructionSet } from 'instruction/interfaces'

const cycleSpeed: number = 1000

const flashStartAddress: Word = Word.fromUnsignedInteger(0x08000000)

type ProcessorEvents = {
  afterCycle: () => void
}

/**
 * The processor is responsible for the actual execcution of the program that is currently stored to flash memory.
 * @author Leo Rudin
 */
export class Processor extends EventEmitter<ProcessorEvents> {
  private readonly registers: Registers
  private readonly memory: IMemory
  private readonly instructions: IInstructionSet

  private interval: number = 0

  constructor(
    registers: Registers,
    memory: IMemory,
    instructions: IInstructionSet
  ) {
    super()
    this.registers = registers
    this.memory = memory
    this.instructions = instructions
  }

  /**
   * Executes the program that is currently saved to the flash part of memory. Only callable
   * if program is not already running.
   * @returns void
   */
  public execute(): void {
    if (this.interval !== 0) return
    this.interval = window.setInterval(this.cycle, cycleSpeed)
  }

  /**
   * Halts the execution but does not reset state of board.
   * @returns void
   */
  public halt(): void {
    window.clearInterval(this.interval)
    this.interval = 0
  }

  /**
   * Resets the whole processor state. It first halts the execution if required and afterwards
   * resets memory and registers.
   * @returns void
   */
  public reset(): void {
    this.halt()

    this.memory.clear()
    this.registers.clear()

    this.registers.writeRegister(Register.PC, flashStartAddress)
    this.registers.writeRegister(Register.SP, Word.fromUnsignedInteger(0))
  }

  private cycle(): void {
    const pc: Word = this.registers.readRegister(Register.PC)
    const opCode: Halfword = this.memory.readHalfword(pc)
    this.instructions
      .getExecutor(opCode)
      .executeInstruction(opCode, this.registers, this.memory)
    this.registers.writeRegister(Register.PC, pc.add(2))
    this.emit('afterCycle')
  }
}
