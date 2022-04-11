import { Halfword } from 'types/binary'

import { Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'

import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'

import { BaseInstruction } from './base'

/**
 * Represents a 'MOV' instruction.
 */
export class MovInstruction extends BaseInstruction {
  public name: string = 'MOV'
  public pattern: string = '01000110XXXXXXXX'
  private rdPattern: string = '01000110X0000XXX'
  private rmPattern: string = '010001100XXXX000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 2)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createRegisterBits(options[1]))
    return opcode
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
