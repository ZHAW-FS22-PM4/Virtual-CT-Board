import { evaluateZeroAndNegativeFlags } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
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
 * Represents a 'MOVS' instruction, getting a value from a register.
 */
export class MovsRegistersInstruction extends BaseInstruction {
  public name: string = 'MOVS'
  public pattern: string = '0000000000XXXXXX'
  private rdPattern: string = '0000000000000XXX'
  private rmPattern: string = '0000000000XXX000'
  private expectedOptionCount: number = 2

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      options.every((x) => !isImmediate(x))
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, this.expectedOptionCount)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let valueToWrite = registers.readRegister(
      getBits(opcode[0], this.rmPattern).value
    )
    registers.setFlags(evaluateZeroAndNegativeFlags(valueToWrite))
    registers.writeRegister(
      getBits(opcode[0], this.rdPattern).value,
      valueToWrite
    )
  }
}

/**
 * Represents a 'MOVS' instruction, getting a value from a literal.
 */
export class MovsImmediate8Instruction extends BaseInstruction {
  public name: string = 'MOVS'
  public pattern: string = '00100XXXXXXXXXXX'
  private rdPattern: string = '00100XXX00000000'
  private immPattern: string = '00100000XXXXXXXX'
  private expectedOptionCount: number = 2
  protected instrWithSameName: BaseInstruction[] = [
    new MovsRegistersInstruction()
  ]

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, this.expectedOptionCount)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(
      opcode,
      this.immPattern,
      createImmediateBits(options[1], 8)
    )
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let valueToWrite = Word.fromHalfwords(getBits(opcode[0], this.immPattern))
    registers.setFlags(evaluateZeroAndNegativeFlags(valueToWrite))
    registers.writeRegister(
      getBits(opcode[0], this.rdPattern).value,
      valueToWrite
    )
  }
}
