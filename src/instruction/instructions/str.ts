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
 * Represents a 'STORE' instruction - STR (immediate offset) - word
 */
export class StoreInstructionImmediateOffset extends BaseInstruction {
  public name: string = 'STR'
  public pattern: string = '01100XXXXXXXXXXX'
  private rnPattern: string = '0110000000XXX000'
  private rtPattern: string = '0110000000000XXX'
  private immPattern: string = '01100XXXXX000000'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(commandName, options) &&
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
    memory.writeWord(
      registers
        .readRegister(getBits(opcode, this.rnPattern).value)
        .add(Word.fromUnsignedInteger(getBits(opcode, this.immPattern).value)),
      registers.readRegister(getBits(opcode, this.rtPattern).value)
    )
  }
}

/**
 * Represents a 'STORE' instruction - STR (register offset) - word
 */
export class StoreInstructionRegisterOffset extends BaseInstruction {
  public name: string = 'STR'
  public pattern: string = '0101000XXXXXXXXX'
  private rnPattern: string = '0101000000XXX000'
  private rmPattern: string = '0101000XXX000000'
  private rtPattern: string = '0101000000000XXX'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(commandName, options) &&
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
    memory.writeWord(
      registers
        .readRegister(getBits(opcode, this.rnPattern).value)
        .add(registers.readRegister(getBits(opcode, this.rmPattern).value)),
      registers.readRegister(getBits(opcode, this.rtPattern).value)
    )
  }
}
