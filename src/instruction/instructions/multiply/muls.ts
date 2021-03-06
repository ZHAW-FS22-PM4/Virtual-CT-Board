import { AluResult, mul } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import {
  checkOptionCount,
  create,
  createLowRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Halfword } from 'types/binary'
import { BaseInstruction } from '../base'

/**
 * Represents a 'MULS' instruction.
 */
export class MulsInstruction extends BaseInstruction {
  public name: string = 'MULS'
  public pattern: string = '0100001101XXXXXX'
  private rdmPattern: string = '0100001101000XXX'
  private rnPattern: string = '0100001101XXX000'

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 3)
    if (options[0] !== options[2]) {
      throw new InstructionError(
        'First and third parameter must be the same register (Rdm = Rn * Rdm).'
      )
    }
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdmPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let rdmRegister = getBits(opcode[0], this.rdmPattern).value
    let aluResult: AluResult = mul(
      registers.readRegister(rdmRegister),
      registers.readRegister(getBits(opcode[0], this.rnPattern).value)
    )
    registers.writeRegister(rdmRegister, aluResult.result)
    registers.setFlags(aluResult.flags)
  }
}
