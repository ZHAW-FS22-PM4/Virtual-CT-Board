import { IELF, SegmentType } from 'assembler/elf'
import InstructionSet from 'instruction/set'
import { Flash } from './devices/flash'
import { Buttons } from './devices/input/buttons'
import { Switches } from './devices/input/switches'
import { SEVENseg } from './devices/output/7seg'
import { LEDDevice } from './devices/output/leds'
import { MemoryBus } from './memory/bus'
import { IMemory } from './memory/interfaces'
import { Processor } from './processor'
import { Registers } from './registers'

class Board {
  public readonly registers: Registers
  public readonly memory: IMemory
  public readonly processor: Processor

  public readonly flash: Flash
  public readonly switches: Switches
  public readonly buttons: Buttons
  public readonly leds: LEDDevice
  public readonly sevenSeg: SEVENseg

  constructor() {
    this.flash = new Flash()
    this.switches = new Switches()
    this.buttons = new Buttons()
    this.leds = new LEDDevice()
    this.registers = new Registers()
    this.sevenSeg = new SEVENseg()
    this.memory = new MemoryBus([
      this.flash,
      this.buttons,
      this.switches,
      this.leds,
      this.sevenSeg
    ])
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
