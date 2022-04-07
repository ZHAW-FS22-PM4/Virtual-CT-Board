import { BaseInstruction } from './baseInstruction'
import {
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  getBits,
  isImmediate,
  isOptionCountValid,
  registerStringHasBrackets,
  removeBracketsFromRegisterString,
  setBits
} from '../opcode'
import { ILabelOffsets } from '../interfaces'
import { Halfword, Word } from '../../types/binary'
import { Registers } from '../../board/registers'
import { IMemory } from '../../board/memory/interfaces'

/**
 * Represents a 'STORE' instruction - STRH (immediate offset) - halfword
 */
export class StoreInstructionImmediateOffsetHalfword extends BaseInstruction {
  public name: string = 'STRH'
  public pattern: string = '10000XXXXXXXXXXX'
  private rnPattern: string = '1000000000XXX000'
  private rtPattern: string = '1000000000000XXX'
  private immPattern: string = '10000XXXXX000000'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      isImmediate(options[2]) &&
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
      this.immPattern,
      createImmediateBits(removeBracketsFromRegisterString(options[2]), 5)
    )
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    memory.writeHalfword(
      registers
        .readRegister(getBits(opcode, this.rnPattern).value)
        .add(Word.fromUnsignedInteger(getBits(opcode, this.immPattern).value)),
      registers
        .readRegister(getBits(opcode, this.rtPattern).value)
        .toHalfwords()[0]
    )
  }
}

/**
 * Represents a 'STORE' instruction - STRH (register offset) - halfword
 */
export class StoreInstructionRegisterOffsetHalfword extends BaseInstruction {
  public name: string = 'STRH'
  public pattern: string = '0101001XXXXXXXXX'
  private rnPattern: string = '0101001000XXX000'
  private rmPattern: string = '0101001XXX000000'
  private rtPattern: string = '0101001000000XXX'
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
    memory.writeHalfword(
      registers
        .readRegister(getBits(opcode, this.rnPattern).value)
        .add(registers.readRegister(getBits(opcode, this.rmPattern).value)),
      registers
        .readRegister(getBits(opcode, this.rtPattern).value)
        .toHalfwords()[0]
    )
  }
}
