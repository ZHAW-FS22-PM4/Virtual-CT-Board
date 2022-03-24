import { Registers } from './registers'
import { Flags } from './flags'
import { Processor } from './processor'
import { IMemory } from './memory/interfaces'
import { MemoryBus } from './memory/bus'

import InstructionSet from 'instruction/set'
import { Flash } from './devices/flash'
import { Switches } from './devices/input/switches'
import { LEDs } from './devices/output/leds'

class Board {
  public readonly registers: Registers
  public readonly flags: Flags
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
    this.flags = new Flags()
    this.memory = new MemoryBus([this.flash, this.switches, this.leds])
    this.processor = new Processor(this.registers, this.memory, InstructionSet)
  }
}

export default new Board()
