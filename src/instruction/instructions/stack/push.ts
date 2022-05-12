import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import { BaseInstruction } from 'instruction/instructions/base'
import {
  checkOptionCount,
  create,
  getBits,
  getEnumValueForRegisterString
} from 'instruction/opcode'
import { Halfword } from 'types/binary'

export class PushInstruction extends BaseInstruction {
  public name: string = 'PUSH'
  public pattern: string = '1011010XXXXXXXXX'

  private lrRegisterPosition = 8

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 1, 9)
    let opcode: Halfword = create(this.pattern)
    const registers = this.getRegisters(options)

    for (const register of registers) {
      if (Registers.isLowRegister(register)) {
        opcode = opcode.setBit(register)
      } else if (register === Register.LR) {
        opcode = opcode.setBit(this.lrRegisterPosition)
      }
    }

    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ) {
    const registerList = getBits(opcode[0], this.pattern)
    const registerValues: Register[] = []
    let bitCount = 0
    for (let i = 0; i <= this.lrRegisterPosition; i++) {
      if (registerList.isBitSet(i)) {
        bitCount++
        registerValues.push(i)
      }
    }

    let address = registers.readRegister(Register.SP).add(-4 * bitCount)
    registers.writeRegister(Register.SP, address)
    for (const register of registerValues) {
      memory.writeWord(address, registers.readRegister(register))
      address = address.add(4)
    }
  }

  private getRegisters(options: string[]): Register[] {
    const registers: Register[] = []
    for (const option of options) {
      let value = option.replace('{', '')
      value = value.replace('}', '')
      if (value.includes('-')) {
        const values = value.split('-')
        const start = this.getRegister(values[0])
        const end = this.getRegister(values[1])
        registers.push(...this.getRegisterRange(start, end))
      } else {
        registers.push(this.getRegister(value))
      }
    }

    return registers
  }

  private getRegisterRange(start: Register, end: Register): Register[] {
    const registers: Register[] = []
    for (let i = start; i <= end; i++) {
      registers.push(i)
    }

    return registers
  }

  private getRegister(value: string): Register {
    const register = getEnumValueForRegisterString(value)
    if (!Registers.isLowRegister(register) && register !== Register.LR) {
      throw new InstructionError(
        'Provided register is not a low register or the LR register.'
      )
    }

    return register
  }
}
