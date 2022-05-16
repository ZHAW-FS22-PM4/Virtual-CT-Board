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
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'

/**
 * Represents a 'LOAD' instruction - LDRH (register offset) - halfword
 */
export class LdrhRegisterOffsetInstruction extends BaseInstruction {
  public name: string = 'LDRH'
  public pattern: string = '0101101XXXXXXXXX'
  private rnPattern: string = '0101101000XXX000'
  private rmPattern: string = '0101101XXX000000'
  private rtPattern: string = '0101101000000XXX'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      !isImmediate(options[2])
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 3)
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
    registers.writeRegister(
      getBits(opcode[0], this.rtPattern).value,
      Word.fromHalfwords(
        memory.readHalfword(
          registers
            .readRegister(getBits(opcode[0], this.rnPattern).value)
            .add(
              registers.readRegister(getBits(opcode[0], this.rmPattern).value)
            )
        )
      )
    )
  }
}

/**
 * Represents a 'LOAD' instruction - LDRH (immediate offset) - halfword
 */
export class LdrhImmediate5OffsetInstruction extends BaseInstruction {
  public name: string = 'LDRH'
  public pattern: string = '10001XXXXXXXXXXX'
  private rnPattern: string = '1000100000XXX000'
  private rtPattern: string = '1000100000000XXX'
  private immPattern: string = '10001XXXXX000000'
  private otherInstructionWithSameName: BaseInstruction[] = [
    new LdrhRegisterOffsetInstruction()
  ]
  private expectedOptionCountMin: number = 2
  private expectedOptionCountMax: number = 3

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      !this.otherInstructionWithSameName.some((instr) => {
        return instr.canEncodeInstruction(name, options)
      })
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
    registers.writeRegister(
      getBits(opcode[0], this.rtPattern).value,
      Word.fromHalfwords(
        memory.readHalfword(
          registers
            .readRegister(getBits(opcode[0], this.rnPattern).value)
            .add(getImmediateBits(opcode[0], this.immPattern, 1).value)
        )
      )
    )
  }
}
