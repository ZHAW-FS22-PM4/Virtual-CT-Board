import { add, AluResult } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import {
  checkOptionCount,
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
 * Class for ADDS instruction adding 2 register values.
 */
export class AddsRegistersInstruction extends BaseInstruction {
  public name: string = 'ADDS'
  public pattern: string = '0001100XXXXXXXXX'
  private rdPattern: string = '0001100000000XXX'
  private rnPattern: string = '0001100000XXX000'
  private rmPattern: string = '0001100XXX000000'

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, 2, 3) &&
      options.every((x) => !isImmediate(x))
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 2, 3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    let rnBits = createLowRegisterBits(options[options.length - 2])
    let rmBits = createLowRegisterBits(options[options.length - 1])
    opcode = setBits(opcode, this.rnPattern, rnBits)
    opcode = setBits(opcode, this.rmPattern, rmBits)
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let rnRegister: number = getBits(opcode[0], this.rnPattern).value
    let rmRegister: number = getBits(opcode[0], this.rmPattern).value
    let rdRegister: number = getBits(opcode[0], this.rdPattern).value

    let rnRegisterContent: Word = registers.readRegister(rnRegister)
    let rmRegisterContent: Word = registers.readRegister(rmRegister)

    let aluResult: AluResult = add(rnRegisterContent, rmRegisterContent)

    registers.writeRegister(rdRegister, aluResult.result)
    registers.setFlags(aluResult.flags)
  }
}

/**
 * Class for ADDS instruction adding a register value and an immediate value.
 */
export class AddsImmediate3Instruction extends BaseInstruction {
  public name: string = 'ADDS'
  public pattern: string = '0001110XXXXXXXXX'
  private rdPattern: string = '0001110000000XXX'
  private rnPattern: string = '0001110000XXX000'
  private immPattern: string = '0001110XXX000000'
  private expectedOptionsCount: number = 3

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, this.expectedOptionsCount) &&
      isImmediate(options[2]) &&
      options[0] !== options[1]
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, this.expectedOptionsCount)
    let immBits = createImmediateBits(options[2], 3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.immPattern, immBits)
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let rnRegister: number = getBits(opcode[0], this.rnPattern).value
    let rdRegister: number = getBits(opcode[0], this.rdPattern).value

    let immValue: Word = Word.fromHalfwords(getBits(opcode[0], this.immPattern))
    let rnRegisterContent: Word = registers.readRegister(rnRegister)

    let aluResult: AluResult = add(rnRegisterContent, immValue)

    registers.writeRegister(rdRegister, aluResult.result)
    registers.setFlags(aluResult.flags)
  }
}

/**
 * Class for ADDS instruction adding an immediate and a register value and
 * storing it in the same register.
 */
export class AddsImmediate8Instruction extends BaseInstruction {
  public name: string = 'ADDS'
  public pattern: string = '00110XXXXXXXXXXX'
  private rdnPattern: string = '00110XXX00000000'
  private immPattern: string = '00110000XXXXXXXX'

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, 2, 3) &&
      isImmediate(options[options.length - 1])
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 2, 3)
    // for ADDS imm8, result and operand must be stored in the same register
    if (options.length === 3 && options[0] !== options[1]) {
      throw new InstructionError(
        'First and second parameter must be the same register (Rdn = Rdn + <imm8>).'
      )
    }
    let regBits = createLowRegisterBits(options[0])
    let immBits = createImmediateBits(options[options.length - 1], 8)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdnPattern, regBits)
    opcode = setBits(opcode, this.immPattern, immBits)
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let rdnRegister: number = getBits(opcode[0], this.rdnPattern).value
    let immValue: Word = Word.fromHalfwords(getBits(opcode[0], this.immPattern))

    let rdnRegisterContent: Word = registers.readRegister(rdnRegister)

    let aluResult: AluResult = add(rdnRegisterContent, immValue)

    registers.writeRegister(rdnRegister, aluResult.result)
    registers.setFlags(aluResult.flags)
  }
}
