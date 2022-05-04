import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Halfword } from 'types/binary'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'
import { BaseInstruction } from '../base'

/**
 * Represents a 'BX' instruction.
 */
export class BxInstruction extends BaseInstruction {
  public name: string = 'BX'
  public pattern: string = '010001110XXXX000'

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
    const register = getBits(opcode[0], this.pattern).value
    const content = registers.readRegister(register)

    if (content.toUnsignedInteger() % 2 !== 0) {
      throw new VirtualBoardError(
        `value of register cannot be divided by 2 and and is therefore not valid`,
        VirtualBoardErrorType.InvalidParamProvided
      )
    }

    registers.writeRegister(Register.PC, content)
  }
}
