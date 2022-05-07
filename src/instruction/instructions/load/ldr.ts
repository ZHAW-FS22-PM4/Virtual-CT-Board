import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
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
  isPCRegister,
  removeBracketsFromRegisterString,
  setBits
} from 'instruction/opcode'
import { $enum } from 'ts-enum-util'
import { Halfword } from 'types/binary'
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
  private otherInstructionWithSameName: BaseInstruction[] = [
    new LdrRegisterOffsetInstruction(),
    new LdrRegisterInstruction()
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
      //just add fix value 0 as immediate
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
    registers.writeRegister(
      getBits(opcode[0], this.rtPattern).value,
      memory.readWord(
        registers
          .readRegister(getBits(opcode[0], this.rnPattern).value)
          .add(getImmediateBits(opcode[0], this.immPattern, 2).value)
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
      !isPCRegister(options[1]) &&
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
 * Represents a 'LOAD' instruction - LDR (programm counter + offset) - word
 */
export class LdrRegisterInstruction extends BaseInstruction {
  public name: string = 'LDR'
  public pattern: string = '01001XXXXXXXXXXX'
  private immPattern: string = '01001000XXXXXXXX'
  private rtPattern: string = '01001XXX00000000'
  private expectedOptionCountMin: number = 2
  private expectedOptionCountMax: number = 3

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(
        options,
        this.expectedOptionCountMin,
        this.expectedOptionCountMax
      ) &&
      (this.isPseudoInstruction(options) ||
        (isPCRegister(options[1]) &&
          (options.length == this.expectedOptionCountMin ||
            isImmediate(options[2]))))
    )
  }

  public encodeInstruction(
    options: string[],
    labels?: ILabelOffsets
  ): Halfword[] {
    checkOptionCount(
      options,
      this.expectedOptionCountMin,
      this.expectedOptionCountMax
    )
    !this.isPseudoInstruction(options) &&
      checkBracketsOnLastOptions(
        options,
        this.expectedOptionCountMin,
        this.expectedOptionCountMax
      )
    let immValue: Halfword
    if (this.isPseudoInstruction(options)) {
      immValue = labels
        ? Halfword.fromUnsignedInteger(labels[options[1]].value)
        : Halfword.fromUnsignedInteger(0x0)
    } else if (options.length == this.expectedOptionCountMin) {
      //just add fix value 0 as immediate
      immValue = Halfword.fromUnsignedInteger(0)
    } else {
      immValue = createImmediateBits(
        removeBracketsFromRegisterString(options[2]),
        8,
        2
      )
    }

    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.immPattern, immValue)
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
          .add(getImmediateBits(opcode[0], this.immPattern, 2).value)
      )
    )
  }

  /**
   * Determines whether the specified instruction is a
   * pseudo instruction.
   *
   * @param options parameter provided for instruction
   * @returns whether the instruction is a pseudo instruction
   */
  private isPseudoInstruction(options: string[]): boolean {
    return options.length === 2 && this.isLiteralString(options[1])
  }

  /**
   * Determines whether the specified string is a
   * a literal (all except valid register, and strings containing any brackets)
   *
   * @param option string provided as param which could be literal
   * @returns whether the string is a literal part of pseudo instruction
   */
  private isLiteralString(option: string): boolean {
    try {
      $enum(Register).getValueOrThrow(option)
      return false
    } catch (e) {
      return !option.includes('[') && !option.includes(']')
    }
  }
}
