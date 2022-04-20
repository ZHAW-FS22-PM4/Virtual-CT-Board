import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import { IInstructionSet } from 'instruction/interfaces'
import { END_OF_CODE } from 'instruction/special'
import { Halfword, Word } from 'types/binary'
import { EventEmitter } from 'types/events/emitter'

const cycleSpeed: number = 200

/**
 * The events which can be emitted by the processor.
 */
type ProcessorEvents = {
  afterCycle: () => void
  afterReset: () => void
  endOfCode: () => void
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
   * Determines whether the processor is currently running.
   *
   * @returns
   */
  public isRunning(): boolean {
    return this.interval !== 0
  }

  /**
   * Executes the program that is currently saved to the flash part of memory. Only callable
   * if program is not already running.
   * @returns void
   */
  public execute(): void {
    if (this.isRunning()) return
    this.interval = window.setInterval(() => this.cycle(), cycleSpeed)
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
   * Runs one processor cycle.
   */
  public step(): void {
    if (this.isRunning()) return
    this.cycle()
  }

  /**
   * Resets the whole processor state. It first halts the execution if required and afterwards
   * resets memory and registers.
   * @returns void
   */
  public reset(): void {
    this.halt()

    this.memory.reset()
    this.registers.reset()

    // According to the ARM convention, the processor initializes:
    // - the stack pointer (SP register) from the address 0x00000000 (alias for 0x08000000)
    // - the program counter (PC register) from the address 0x00000004 (alias for 0x08000004)
    this.registers.writeRegister(
      Register.SP,
      this.memory.readWord(Word.fromUnsignedInteger(0x08000000))
    )
    this.registers.writeRegister(
      Register.PC,
      this.memory.readWord(Word.fromUnsignedInteger(0x08000004))
    )

    this.emit('afterReset')
  }

  private cycle() {
    const pc: Word = this.registers.readRegister(Register.PC)
    const opcode: Halfword = this.memory.readHalfword(pc)
    if (opcode.value === END_OF_CODE.value) {
      this.halt()
      this.emit('endOfCode')
      return
    }
    this.instructions
      .getExecutor(opcode)
      .executeInstruction(opcode, this.registers, this.memory)
    this.registers.writeRegister(Register.PC, pc.add(2))
    this.emit('afterCycle')
  }
}
