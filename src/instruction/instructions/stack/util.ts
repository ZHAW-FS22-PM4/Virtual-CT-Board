import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import { getBits, getEnumValueForRegisterString } from 'instruction/opcode'
import { $enum } from 'ts-enum-util'
import { Halfword } from 'types/binary'
import { BaseInstruction } from '../base'

export abstract class StackInstruction extends BaseInstruction {
  public pattern: string = '1011X10XXXXXXXXX'
  /**
   * PC for pop instruction and LR for push instruction
   */
  protected abstract additionalRegister: Register
  private registerBitsPattern: string = '1011010XXXXXXXXX'
  private lrOrPcRegisterPosition = 8
  protected setStackRegisterBits(
    opcode: Halfword,
    options: string[]
  ): Halfword {
    let registers = this.getRegisters(options)

    for (const register of registers) {
      if (Registers.isLowRegister(register)) {
        opcode = opcode.setBit(register)
      } else if (this.correctLrOrPcRegisterProvided(register)) {
        opcode = opcode.setBit(this.lrOrPcRegisterPosition)
      }
    }

    return opcode
  }
  protected getStackRegisterFromOpcode(opcode: Halfword): Register[] {
    const registerList = getBits(opcode, this.registerBitsPattern)
    const registerValues: Register[] = []
    for (let i = 0; i < this.lrOrPcRegisterPosition; i++) {
      if (registerList.isBitSet(i)) {
        registerValues.push(i)
      }
    }
    if (registerList.isBitSet(this.lrOrPcRegisterPosition)) {
      registerValues.push(this.additionalRegister)
    }

    return registerValues
  }

  private correctLrOrPcRegisterProvided(register: Register): boolean {
    return register === this.additionalRegister
  }

  private getRegisters(options: string[]): Register[] {
    const registers: Register[] = []
    options[0] = options[0].replace('{', '').trim()
    options[options.length - 1] = options[options.length - 1]
      .replace('}', '')
      .trim()

    for (const option of options) {
      if (option.includes('-')) {
        const values = option.split('-')
        const start = this.getRegister(values[0])
        const end = this.getRegister(values[1])
        this.getRegisterRange(start, end).forEach((r) =>
          this.addRegisterToList(registers, r)
        )
      } else {
        this.addRegisterToList(registers, this.getRegister(option))
      }
    }
    return registers
  }

  private addRegisterToList(list: Register[], register: Register) {
    if (list.includes(register)) {
      throw new InstructionError(
        `Register ${register} multiple times provided in stack options.`
      )
    }
    list.push(register)
  }

  private getRegisterRange(start: Register, end: Register): Register[] {
    const registers: Register[] = []
    if (start > end) {
      throw new InstructionError('End of range can not be before start of it.')
    }
    for (let i = start; i <= end; i++) {
      registers.push(i)
    }

    return registers
  }

  private getRegister(value: string): Register {
    const register = getEnumValueForRegisterString(value.trim())
    if (
      !Registers.isLowRegister(register) &&
      !this.correctLrOrPcRegisterProvided(register)
    ) {
      throw new InstructionError(
        `Provided register is not a low register or the ${$enum(
          Register
        ).getKeyOrThrow(this.additionalRegister)} register.`
      )
    }
    return register
  }

  /**
   * Convenience method to throw an InstructionError if encoder is not called with correctly set curly brackets.
   * If only one option provided this param has to have opening and closing brackets and
   * other wise opening on first and closing on last param expected.
   * @param options parameter provided to encodeInstruction method
   */
  protected checkCurlyBracketsOnOptions(options: string[]): void {
    if (!this.stackOptionsEnclosedInCurlyBrackets(options)) {
      if (options.length == 1) {
        throw new InstructionError(
          `Opening or closing curly bracket missing for 1. param.`
        )
      } else {
        throw new InstructionError(
          `Opening curly bracket on 1. param or closing bracket on ${options.length}. param missing.`
        )
      }
    }
  }

  /**
   * Checks if the curly brackets are set correct on the stack options.
   * @param options where to check for the left bracket and right bracket
   * @returns true if the brackets are set correct
   */
  private stackOptionsEnclosedInCurlyBrackets(options: string[]): boolean {
    return (
      options.length >= 1 &&
      options[0].startsWith('{') &&
      options[options.length - 1].endsWith('}')
    )
  }
}
