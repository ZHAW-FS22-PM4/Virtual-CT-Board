import { IELF, SegmentType } from 'assembler/elf/interfaces'
import InstructionSet from 'instruction/set'
import { Flash } from './devices/flash'
import { ButtonsDevice } from './devices/input/buttons'
import { DipSwitchesDevice } from './devices/input/dip-switches'
import { HexSwitchDevice } from './devices/input/hex-switch'
import { LcdDevice } from './devices/output/lcd'
import { LedsDevice } from './devices/output/leds'
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
  public readonly dipSwitches: DipSwitchesDevice
  public readonly buttons: ButtonsDevice
  public readonly leds: LedsDevice
  public readonly hexSwitch: HexSwitchDevice
  public readonly lcd: LcdDevice

  private executable?: IELF

  constructor() {
    this.flash = new Flash()
    this.ram = new SRAM()
    this.dipSwitches = new DipSwitchesDevice()
    this.buttons = new ButtonsDevice()
    this.hexSwitch = new HexSwitchDevice()
    this.leds = new LedsDevice()
    this.lcd = new LcdDevice()
    this.registers = new Registers()
    this.memory = new MemoryBus([
      this.flash,
      this.ram,
      this.dipSwitches,
      this.buttons,
      this.hexSwitch,
      this.leds,
      this.lcd
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
