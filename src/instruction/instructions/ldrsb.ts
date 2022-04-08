import { Halfword, Word } from 'types/binary'

import { Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'

import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createLowRegisterBits,
  getBits,
  isImmediate,
  isOptionCountValid,
  registerStringHasBrackets,
  removeBracketsFromRegisterString,
  setBits
} from 'instruction/opcode'

import { BaseInstruction } from './base'

/**
 * Represents a 'LOAD' instruction - LDRSB (register offset) - byte
 */
export class LdrsbRegisterOffsetInstruction extends BaseInstruction {
  public name: string = 'LDRSB'
  public pattern: string = '0101011XXXXXXXXX'
  private rnPattern: string = '0101011000XXX000'
  private rmPattern: string = '0101011XXX000000'
  private rtPattern: string = '0101011000000XXX'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      !isImmediate(options[2]) &&
      registerStringHasBrackets(options[1], options[2])
    )
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))
    opcode = setBits(
      opcode,
      this.rnPattern,
      createLowRegisterBits(removeBracketsFromRegisterString(options[1]))
    )
    opcode = setBits(
      opcode,
      this.rmPattern,
      createLowRegisterBits(removeBracketsFromRegisterString(options[2]))
    )
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister(
      getBits(opcode, this.rtPattern).value,
      Word.fromBytes(
        memory.readByte(
          registers
            .readRegister(getBits(opcode, this.rnPattern).value)
            .add(registers.readRegister(getBits(opcode, this.rmPattern).value))
        )
      )
    )
  }
}
