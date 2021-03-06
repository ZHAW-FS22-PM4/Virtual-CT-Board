import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import { checkOptionCount, create } from 'instruction/opcode'
import { Halfword } from 'types/binary'
import { StackInstruction } from './util'

export class PopInstruction extends StackInstruction {
  public name: string = 'POP'
  public pattern: string = '1011110XXXXXXXXX'
  protected additionalRegister: Register = Register.PC

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
    let address = registers.readRegister(Register.SP)
    for (const registerVal of registerValues) {
      registers.writeRegister(registerVal, memory.readWord(address))
      address = address.add(4)
    }
    registers.writeRegister(Register.SP, address)
  }
}
