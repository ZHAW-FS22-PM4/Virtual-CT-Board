import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
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
import { BaseInstruction } from './base'

/**
 * Represents a 'LOAD' instruction - LDRB (register offset) - byte
 */
export class LdrbRegisterOffsetInstruction extends BaseInstruction {
  public name: string = 'LDRB'
  public pattern: string = '0101110XXXXXXXXX'
  private rnPattern: string = '0101110000XXX000'
  private rmPattern: string = '0101110XXX000000'
  private rtPattern: string = '0101110000000XXX'
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

/**
 * Represents a 'LOAD' instruction - LDRB (immediate offset) - byte
 */
export class LdrbImmediate5OffsetInstruction extends BaseInstruction {
  public name: string = 'LDRB'
  public pattern: string = '01111XXXXXXXXXXX'
  private rnPattern: string = '0111100000XXX000'
  private rtPattern: string = '0111100000000XXX'
  private immPattern: string = '01111XXXXX000000'
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
    registers.writeRegister(
      getBits(opcode, this.rtPattern).value,
      Word.fromBytes(
        memory.readByte(
          registers
            .readRegister(getBits(opcode, this.rnPattern).value)
            .add(
              Word.fromUnsignedInteger(getBits(opcode, this.immPattern).value)
            )
        )
      )
    )
  }
}