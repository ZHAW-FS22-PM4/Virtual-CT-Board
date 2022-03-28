import { Halfword, Word } from 'types/binary'
import {
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  createRegisterBits,
  getBits,
  isImmediate,
  isOptionCountValid,
  setBits
} from 'instruction/opcode'
import { Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'

import { ILabelOffsets } from '../interfaces'
import { BaseInstruction } from './baseInstruction'

/**
 * Represents a 'MOV' instruction.
 */
export class LoadInstruction extends BaseInstruction {
  public name: string = 'LDR'
  public name: string = 'STR'
  public pattern: string ='' //toDo
  private rdPattern: string ='' //toDo
  private rmPattern: string = ''//toDo

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    // toDo
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister(
      getBits(opcode, this.rdPattern).value,
      registers.readRegister(getBits(opcode, this.rmPattern).value)
    )
  }
}
