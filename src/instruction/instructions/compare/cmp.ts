import { sub } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import {
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  createRegisterBits,
  getBits,
  isImmediate,
  isLowRegister,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'

export class CmpInstructionWithLowRegisters extends BaseInstruction {
  public name: string = 'CMP'
  public pattern: string = '0100001010XXXXXX'
  private rnPattern: string = '0100001010000XXX'
  private rmPattern: string = '0100001010XXX000'
  private optionCount: number = 2

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      options.every((x) => !isImmediate(x) && isLowRegister(x))
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, this.optionCount)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
    return [opcode]
  }

  public executeInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    const rn = getBits(opcode[0], this.rnPattern)
    const rm = getBits(opcode[0], this.rmPattern)
    const result = sub(
      registers.readRegister(rn.value),
      registers.readRegister(rm.value)
    )
    registers.setFlags(result.flags)
  }
}

export class CmpInstructionWithHighRegisters extends BaseInstruction {
  public name: string = 'CMP'
  public pattern: string = '01000101XXXXXXXX'
  private rnPattern: string = '01000101X0000XXX'
  private rmPattern: string = '010001010XXXX000'
  private optionCount: number = 2

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      options.find((x) => !isImmediate(x) && !isLowRegister(x)) !== undefined
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, this.optionCount)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rnPattern, createRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createRegisterBits(options[1]))
    return [opcode]
  }

  public executeInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    const rn = getBits(opcode[0], this.rnPattern)
    const rm = getBits(opcode[0], this.rmPattern)
    const result = sub(
      registers.readRegister(rn.value),
      registers.readRegister(rm.value)
    )
    registers.setFlags(result.flags)
  }
}

export class CmpInstructionWithImmediateOffset extends BaseInstruction {
  public name: string = 'CMP'
  public pattern: string = '00101XXXXXXXXXXX'
  private rnPattern: string = '00101XXX00000000'
  private immPattern: string = '00101000XXXXXXXX'
  private optionCount: number = 2

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isLowRegister(options[0]) &&
      isImmediate(options[1])
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, this.optionCount)
    let opcode: Halfword = create(this.pattern)
    let immBits: Halfword = createImmediateBits(options[1], 8)
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.immPattern, immBits)
    return [opcode]
  }

  public executeInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    const rn = getBits(opcode[0], this.rnPattern)
    const imm = getBits(opcode[0], this.immPattern)
    const result = sub(
      registers.readRegister(rn.value),
      Word.fromUnsignedInteger(imm.value)
    )
    registers.setFlags(result.flags)
  }
}
