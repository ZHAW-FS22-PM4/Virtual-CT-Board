import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import {
  checkBracketsOnLastOptions,
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  getBits,
  getImmediateBits,
  isImmediate,
  isOptionCountValid,
  removeBracketsFromRegisterString,
  setBits
} from 'instruction/opcode'
import { Halfword } from 'types/binary'
import { BaseInstruction } from '../base'

/**
 * Represents a 'STORE' instruction - STRH (immediate offset) - halfword
 */
export class StrhImmediate5OffsetInstruction extends BaseInstruction {
  public name: string = 'STRH'
  public pattern: string = '10000XXXXXXXXXXX'
  private rnPattern: string = '1000000000XXX000'
  private rtPattern: string = '1000000000000XXX'
  private immPattern: string = '10000XXXXX000000'
  private expectedOptionCountMin: number = 2
  private expectedOptionCountMax: number = 3
  private instrWithSameName: BaseInstruction[] = [
    new StrhRegisterOffsetInstruction()
  ]

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      !this.instrWithSameName.some((i) => i.canEncodeInstruction(name, options))
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(
      options,
      this.expectedOptionCountMin,
      this.expectedOptionCountMax
    )
    checkBracketsOnLastOptions(
      options,
      this.expectedOptionCountMin,
      this.expectedOptionCountMax
    )
    if (options.length == this.expectedOptionCountMin) {
      options.push('#0')
    }
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
      createImmediateBits(removeBracketsFromRegisterString(options[2]), 5, 1)
    )
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    memory.writeHalfword(
      registers
        .readRegister(getBits(opcode[0], this.rnPattern).value)
        .add(getImmediateBits(opcode[0], this.immPattern, 1).value),
      registers
        .readRegister(getBits(opcode[0], this.rtPattern).value)
        .toHalfwords()[0]
    )
  }
}

/**
 * Represents a 'STORE' instruction - STRH (register offset) - halfword
 */
export class StrhRegisterOffsetInstruction extends BaseInstruction {
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
      !isImmediate(options[2])
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, this.expectedOptionCount)
    checkBracketsOnLastOptions(options, this.expectedOptionCount)
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
    memory.writeHalfword(
      registers
        .readRegister(getBits(opcode[0], this.rnPattern).value)
        .add(registers.readRegister(getBits(opcode[0], this.rmPattern).value)),
      registers
        .readRegister(getBits(opcode[0], this.rtPattern).value)
        .toHalfwords()[0]
    )
  }
}
