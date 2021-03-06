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
 * Represents a 'STORE' instruction - STR (immediate offset) - word
 */
export class StrImmediate5OffsetInstruction extends BaseInstruction {
  public name: string = 'STR'
  public pattern: string = '01100XXXXXXXXXXX'
  private rnPattern: string = '0110000000XXX000'
  private rtPattern: string = '0110000000000XXX'
  private immPattern: string = '01100XXXXX000000'
  private expectedOptionCountMin: number = 2
  private expectedOptionCountMax: number = 3
  protected instrWithSameName: BaseInstruction[] = [
    new StrRegisterOffsetInstruction()
  ]

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
    if (options.length === this.expectedOptionCountMin) {
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
      createImmediateBits(removeBracketsFromRegisterString(options[2]), 5, 2)
    )
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    memory.writeWord(
      registers
        .readRegister(getBits(opcode[0], this.rnPattern).value)
        .add(getImmediateBits(opcode[0], this.immPattern, 2).value),
      registers.readRegister(getBits(opcode[0], this.rtPattern).value)
    )
  }
}

/**
 * Represents a 'STORE' instruction - STR (register offset) - word
 */
export class StrRegisterOffsetInstruction extends BaseInstruction {
  public name: string = 'STR'
  public pattern: string = '0101000XXXXXXXXX'
  private rnPattern: string = '0101000000XXX000'
  private rmPattern: string = '0101000XXX000000'
  private rtPattern: string = '0101000000000XXX'
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
    memory.writeWord(
      registers
        .readRegister(getBits(opcode[0], this.rnPattern).value)
        .add(registers.readRegister(getBits(opcode[0], this.rmPattern).value)),
      registers.readRegister(getBits(opcode[0], this.rtPattern).value)
    )
  }
}
