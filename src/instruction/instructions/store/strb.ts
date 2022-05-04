import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
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
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'

/**
 * Represents a 'STORE' instruction - STRB (immediate offset) - byte
 */
export class StrbImmediate5OffsetInstruction extends BaseInstruction {
  public name: string = 'STRB'
  public pattern: string = '01110XXXXXXXXXXX'
  private rnPattern: string = '0111000000XXX000'
  private rtPattern: string = '0111000000000XXX'
  private immPattern: string = '01110XXXXX000000'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      isImmediate(options[2]) &&
      registerStringHasBrackets(options[1], options[2])
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
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
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    memory.writeByte(
      registers
        .readRegister(getBits(opcode[0], this.rnPattern).value)
        .add(
          Word.fromUnsignedInteger(getBits(opcode[0], this.immPattern).value)
        ),
      registers
        .readRegister(getBits(opcode[0], this.rtPattern).value)
        .toBytes()[0]
    )
  }
}

/**
 * Represents a 'STORE' instruction - STRB (register offset) - byte
 */
export class StrbRegisterOffsetInstruction extends BaseInstruction {
  public name: string = 'STRB'
  public pattern: string = '0101010XXXXXXXXX'
  private rnPattern: string = '0101010000XXX000'
  private rmPattern: string = '0101010XXX000000'
  private rtPattern: string = '0101010000000XXX'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      !isImmediate(options[2]) &&
      registerStringHasBrackets(options[1], options[2])
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
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
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    memory.writeByte(
      registers
        .readRegister(getBits(opcode[0], this.rnPattern).value)
        .add(registers.readRegister(getBits(opcode[0], this.rmPattern).value)),
      registers
        .readRegister(getBits(opcode[0], this.rtPattern).value)
        .toBytes()[0]
    )
  }
}
