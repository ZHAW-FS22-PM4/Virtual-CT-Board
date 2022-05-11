import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Halfword } from 'types/binary'
import { BaseInstruction } from '../base'

/**
 * Represents a 'BLX' instruction.
 */
export class BlxInstruction extends BaseInstruction {
  public name: string = 'BLX'
  public pattern: string = '010001111XXXX000'

  public encodeInstruction(
    options: string[],
    labels?: ILabelOffsets
  ): Halfword[] {
    checkOptionCount(options, 1)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.pattern, createRegisterBits(options[0]))
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister(
      Register.LR,
      registers.readRegister(Register.PC).add(-2)
    )

    const rmRegister = getBits(opcode[0], this.pattern).value
    const content = registers.readRegister(rmRegister)
    if (content.toUnsignedInteger() % 2 !== 0) {
      throw new InstructionError(
        'Value of register cannot be divided by 2 and and is therefore not valid.'
      )
    }
    registers.writeRegister(Register.PC, content)
  }
}
