import { Registers } from './registers'
import { Processor } from './processor'
import { IMemory } from './memory/interfaces'
import { MemoryBus } from './memory/bus'

import InstructionSet from 'instruction/set'
import { IDevice } from './devices/interfaces'
import { Flash } from './devices/flash'
import { Switches } from './devices/input/switches'
import { LEDs } from './devices/output/leds'

class Board {
  public readonly registers: Registers
  public readonly memory: IMemory
  public readonly processor: Processor

  public readonly devices: IDevice[]
  
  public readonly flash: Flash

  constructor () {
    //TODO flash as own property or within devices
    this.flash = new Flash()
    this.devices = [this.flash, new Switches(), new LEDs()]
    this.registers = new Registers()
    this.memory = new MemoryBus(this.devices)
    this.processor = new Processor(this.registers, this.memory, InstructionSet)
  }
}

export default new Board()
