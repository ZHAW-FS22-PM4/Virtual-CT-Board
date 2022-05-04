import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
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
 * Represents a 'LOAD' instruction - LDR (immediate offset) - word
 */
export class LdrImmediate5OffsetInstruction extends BaseInstruction {
  public name: string = 'LDR'
  public pattern: string = '01101XXXXXXXXXXX'
  private rnPattern: string = '0110100000XXX000'
  private rtPattern: string = '0110100000000XXX'
  private immPattern: string = '01101XXXXX000000'
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
    registers.writeRegister(
      getBits(opcode[0], this.rtPattern).value,
      memory.readWord(
        registers
          .readRegister(getBits(opcode[0], this.rnPattern).value)
          .add(
            Word.fromUnsignedInteger(getBits(opcode[0], this.immPattern).value)
          )
      )
    )
  }
}

/**
 * Represents a 'LOAD' instruction - LDR (register offset) - word
 */
export class LdrRegisterOffsetInstruction extends BaseInstruction {
  public name: string = 'LDR'
  public pattern: string = '0101100XXXXXXXXX'
  private rnPattern: string = '0101100000XXX000'
  private rmPattern: string = '0101100XXX000000'
  private rtPattern: string = '0101100000000XXX'
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
    registers.writeRegister(
      getBits(opcode[0], this.rtPattern).value,
      memory.readWord(
        registers
          .readRegister(getBits(opcode[0], this.rnPattern).value)
          .add(registers.readRegister(getBits(opcode[0], this.rmPattern).value))
      )
    )
  }
}

/**
 * Represents a 'LOAD' instruction - LDR (pointer + offset) - word
 */
export class LdrRegisterInstruction extends BaseInstruction {
  public name: string = 'LDR'
  public pattern: string = '01001XXXXXXXXXXX'
  private immPattern: string = '01001000XXXXXXXX'
  private rtPattern: string = '01001XXX00000000'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      isImmediate(options[2]) &&
      registerStringHasBrackets(options[1], options[2]) &&
      'PC' === removeBracketsFromRegisterString(options[1])
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))
    opcode = setBits(
      opcode,
      this.immPattern,
      createImmediateBits(removeBracketsFromRegisterString(options[2]), 8)
    )
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister(
      getBits(opcode[0], this.rtPattern).value,
      memory.readWord(
        registers
          .readRegister(Register.PC)
          .add(getBits(opcode[0], this.immPattern).value)
      )
    )
  }
}

/**
 * Represents a 'LOAD' instruction - LDR (pointer + offset) - word
 */
export class LdrLabelInstruction extends BaseInstruction {
  public name: string = 'LDR'
  public pattern: string = '01001XXXXXXXXXXX'
  private immPattern: string = '01001000XXXXXXXX'
  private rtPattern: string = '01001XXX00000000'
  private expectedOptionCount: number = 2

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, this.expectedOptionCount)
    )
  }

  public encodeInstruction(
    options: string[],
    labels?: ILabelOffsets
  ): Halfword[] {
    checkOptionCount(options, this.expectedOptionCount)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))
    opcode = setBits(
      opcode,
      this.immPattern,
      labels
        ? Halfword.fromUnsignedInteger(labels[options[1]].value)
        : Halfword.fromUnsignedInteger(0x0)
    )
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister(
      getBits(opcode[0], this.rtPattern).value,
      memory.readWord(
        registers
          .readRegister(Register.PC)
          .add(getBits(opcode[0], this.immPattern).value)
      )
    )
  }
}
