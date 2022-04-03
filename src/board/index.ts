import { Registers } from './registers'
import { Processor } from './processor'
import { IMemory } from './memory/interfaces'
import { MemoryBus } from './memory/bus'

import InstructionSet from 'instruction/set'
import { Flash } from './devices/flash'
import { Switches } from './devices/input/switches'
import { LEDs } from './devices/output/leds'
import { IELF, SegmentType } from 'assembler/elf'

class Board {
  public readonly registers: Registers
  public readonly memory: IMemory
  public readonly processor: Processor

  public readonly flash: Flash
  public readonly switches: Switches
  public readonly leds: LEDs

  constructor() {
    this.flash = new Flash()
    this.switches = new Switches()
    this.leds = new LEDs()
    this.registers = new Registers()
    this.memory = new MemoryBus([this.flash, this.switches, this.leds])
    this.processor = new Processor(this.registers, this.memory, InstructionSet)
  }

  /**
   * Loads the executable file created by the assembler into the board.
   *
   * @param file the executable file to load
   */
  public loadExecutable(file: IELF): void {
    if (this.processor.isRunning()) {
      throw new Error('Can not load executable while processor is running.')
    }
    for (const segment of file.segments) {
      if (segment.type === SegmentType.LOAD) {
        this.memory.writeBytes(
          segment.address,
          file.content.slice(
            segment.offset.value,
            segment.offset.value + segment.size.value
          )
        )
      }
    }
    this.processor.reset()
  }
}

export default new Board()
