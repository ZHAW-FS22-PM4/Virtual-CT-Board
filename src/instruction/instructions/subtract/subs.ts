import { sub } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import {
  create,
  createImmediateBits,
  createLowRegisterBits,
  getBits,
  isImmediate,
  isOptionCountValid,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'

/**
 * Represents a 'SUBS' instruction which substracts a register
 * from a register and stores the result in another register.
 */
export class SubsRegistersInstruction extends BaseInstruction {
  public name: string = 'SUBS'
  public pattern: string = '0001101XXXXXXXXX'
  private rdPattern: string = '0001101000000XXX'
  private rnPattern: string = '0001101000XXX000'
  private rmPattern: string = '0001101XXX000000'
  private minExpectedOptionCount: number = 2
  private maxExpectedOptionCount: number = 3

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(
        options,
        this.minExpectedOptionCount,
        this.maxExpectedOptionCount
      ) &&
      !isImmediate(options[2])
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))

    opcode = setBits(
      opcode,
      this.rnPattern,
      createLowRegisterBits(options[options.length === 2 ? 0 : 1])
    )
    opcode = setBits(
      opcode,
      this.rmPattern,
      createLowRegisterBits(options[options.length === 2 ? 1 : 2])
    )

    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    const rd = getBits(opcode[0], this.rdPattern)
    const rn = getBits(opcode[0], this.rnPattern)
    const rm = getBits(opcode[0], this.rmPattern)
    const result = sub(
      registers.readRegister(rn.value),
      registers.readRegister(rm.value)
    )
    registers.setFlags(result.flags)
    registers.writeRegister(rd.value, result.result)
  }
}

/**
 * Represents a 'SUBS' instruction which substracts a small immediate value
 * from a register and stores the result in another register.
 */
export class SubsImmediate3Instruction extends BaseInstruction {
  public name: string = 'SUBS'
  public pattern: string = '0001111XXXXXXXXX'
  private rdPattern: string = '0001111000000XXX'
  private rnPattern: string = '0001111000XXX000'
  private imm3Pattern: string = '0001111XXX000000'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      isImmediate(options[2])
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    opcode = setBits(
      opcode,
      this.imm3Pattern,
      createImmediateBits(options[2], 3)
    )
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    const rd = getBits(opcode[0], this.rdPattern)
    const rn = getBits(opcode[0], this.rnPattern)
    const imm3 = getBits(opcode[0], this.imm3Pattern)
    const result = sub(
      registers.readRegister(rn.value),
      Word.fromUnsignedInteger(imm3.value)
    )
    registers.setFlags(result.flags)
    registers.writeRegister(rd.value, result.result)
  }
}

/**
 * Represents a 'SUBS' instruction which substracts a large immediate value
 * from a register and stores the result in the first register.
 */
export class SubsImmediate8Instruction extends BaseInstruction {
  public name: string = 'SUBS'
  public pattern: string = '00111XXXXXXXXXXX'
  private rdnPattern: string = '00111XXX00000000'
  private imm8Pattern: string = '00111000XXXXXXXX'
  private expectedOptionCount: number = 2

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      isImmediate(options[1])
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(
      opcode,
      this.imm8Pattern,
      createImmediateBits(options[1], 8)
    )
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    const rdn = getBits(opcode[0], this.rdnPattern)
    const imm8 = getBits(opcode[0], this.imm8Pattern)
    const result = sub(
      registers.readRegister(rdn.value),
      Word.fromUnsignedInteger(imm8.value)
    )
    registers.setFlags(result.flags)
    registers.writeRegister(rdn.value, result.result)
  }
}
