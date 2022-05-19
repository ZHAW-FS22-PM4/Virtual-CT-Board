import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
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
  isLiteralString,
  isOptionCountValid,
  isPCRegister,
  removeBracketsFromRegisterString,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { limitValuesToBitCount } from 'types/binary/utils'
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
  private instrWithSameName: BaseInstruction[] = [
    new LdrRegisterOffsetInstruction(),
    new LdrRegisterInstruction()
  ]
  private expectedOptionCountMin: number = 2
  private expectedOptionCountMax: number = 3

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
    if (options.length === this.expectedOptionCountMin) {
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
  public needsLabels: boolean = true

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(
        options,
        this.expectedOptionCountMin,
        this.expectedOptionCountMax
      ) &&
      (isLabelOffsetInstruction(options) ||
        (isPCRegister(options[1]) &&
          (options.length === this.expectedOptionCountMin ||
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
    const instrHasLabelAsOffset = isLabelOffsetInstruction(options)
    if (!instrHasLabelAsOffset) {
      checkBracketsOnLastOptions(
        options,
        this.expectedOptionCountMin,
        this.expectedOptionCountMax
      )
      if (!isPCRegister(options[1])) {
        throw new InstructionError('Second param is not PC register')
      }
    }
    let immValue: Halfword
    if (instrHasLabelAsOffset) {
      let pseudoValue = options[1]
      if (pseudoValue.startsWith('=')) {
        pseudoValue = pseudoValue.slice(1).trim()
      }
      immValue = createImmediateBits(
        //limit bit count so negative values will not be considered wrong
        `#${
          labels ? limitValuesToBitCount(labels[pseudoValue].value, 8) : '0' //VCB-176 --> limitValuesToBitCount 10 instead of 8 as param
        }`,
        8,
        0 //VCB-176 --> 2
      )
    } else if (options.length === this.expectedOptionCountMin) {
      //just add fix value 0 as immediate
      immValue = Halfword.fromUnsignedInteger(0)
    } else {
      immValue = createImmediateBits(
        removeBracketsFromRegisterString(options[2]),
        8,
        0 //VCB-176 when word aligned --> 2
      )
    }

    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))

    //known issue: offset provided by label could not be word aligned
    //workaround: instead of word aligned offset is in bytes --> offset range is smaller and opcode is not as on physical ct board
    //but functionality is as it should
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
        Word.fromUnsignedInteger(
          //VCB-176 --> alignPointer(registers.readRegister(Register.PC).value, 4)
          registers.readRegister(Register.PC).value +
            getImmediateBits(opcode[0], this.immPattern, 0).value //VCB-176 --> getImmediateBits 2 instead of 0
        )
      )
    )
  }
}

/**
 * Determines whether the specified instruction is a
 * pseudo instruction.
 *
 * @param options parameter provided for instruction
 * @returns whether the instruction is a pseudo instruction
 */
function isLabelOffsetInstruction(options: string[]): boolean {
  return options.length === 2 && isLiteralString(options[1])
}
