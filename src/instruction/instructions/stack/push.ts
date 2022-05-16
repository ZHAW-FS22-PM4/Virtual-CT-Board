import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import { checkOptionCount, create } from 'instruction/opcode'
import { Halfword } from 'types/binary'
import { StackInstruction } from './util'

export class PushInstruction extends StackInstruction {
  public name: string = 'PUSH'
  public pattern: string = '1011010XXXXXXXXX'
  protected additionalRegister: Register = Register.LR

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 1, 9)
    this.checkCurlyBracketsOnOptions(options)
    let opcode: Halfword = create(this.pattern)
    opcode = this.setStackRegisterBits(opcode, options)
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ) {
    let registerValues = this.getStackRegisterFromOpcode(opcode[0])

    let address = registers
      .readRegister(Register.SP)
      .add(-4 * registerValues.length)
    registers.writeRegister(Register.SP, address)
    for (const registerVal of registerValues) {
      memory.writeWord(address, registers.readRegister(registerVal))
      address = address.add(4)
    }
  }
}
