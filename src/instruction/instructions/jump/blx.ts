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
    registers.writeRegister(Register.PC, content)
  }
}
