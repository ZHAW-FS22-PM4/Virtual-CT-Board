import { IELF, SegmentType } from 'assembler/elf/interfaces'
import InstructionSet from 'instruction/set'
import { Flash } from './devices/flash'
import { Buttons } from './devices/input/buttons'
import { Switches } from './devices/input/switches'
import { LcdDisplay } from './devices/output/lcd'
import { SEVENseg } from './devices/output/7seg'
import { LEDDevice } from './devices/output/leds'
import { SRAM } from './devices/sram'
import { MemoryBus } from './memory/bus'
import { IMemory } from './memory/interfaces'
import { Processor } from './processor'
import { Registers } from './registers'

class Board {
  public readonly registers: Registers
  public readonly memory: IMemory
  public readonly processor: Processor

  public readonly flash: Flash
  public readonly ram: SRAM
  public readonly switches: Switches
  public readonly buttons: Buttons
  public readonly leds: LEDDevice
  public readonly lcdDisplay: LcdDisplay
  public readonly sevenSeg: SEVENseg

  private executable?: IELF

  constructor() {
    this.flash = new Flash()
    this.ram = new SRAM()
    this.switches = new Switches()
    this.buttons = new Buttons()
    this.leds = new LEDDevice()
    this.lcdDisplay = new LcdDisplay()
    this.registers = new Registers()
    this.sevenSeg = new SEVENseg()
    this.memory = new MemoryBus([
      this.flash,
      this.ram,
      this.buttons,
      this.switches,
      this.leds,
      this.lcdDisplay,
      this.sevenSeg
    ])
    this.processor = new Processor(this.registers, this.memory, InstructionSet)
    this.processor.on('reset', () => this.reloadExecutable())
  }

  /**
   * Gets the executable which is currently loaded to the board
   *
   * @returns the executable or undefined if none is loaded
   */
  public getExecutable(): IELF | undefined {
    return this.executable
  }

  /**
   * Loads the executable file created by the assembler into the board.
   *
   * @param executable the executable file to load
   */
  public loadExecutable(executable: IELF): void {
    this.executable = executable
    this.processor.reset()
  }

  /**
   * Reloads the executable.
   */
  private reloadExecutable() {
    if (this.executable) {
      for (const segment of this.executable.segments) {
        if (segment.type === SegmentType.Load) {
          this.memory.writeBytes(
            segment.address,
            this.executable.content.slice(
              segment.offset,
              segment.offset + segment.size
            )
          )
        }
      }
    }
  }
}

export default new Board()
