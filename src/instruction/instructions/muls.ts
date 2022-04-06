import { Halfword } from 'types/binary'
import {
  checkOptionCount,
  create,
  createLowRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'
import { ILabelOffsets } from '../interfaces'
import { BaseInstruction } from './baseInstruction'
import { mul, AluResult } from 'board/alu'

/**
 * Represents a 'MULS' instruction.
 */
export class MulsInstruction extends BaseInstruction {
  public name: string = 'MULS'
  public pattern: string = '0100001101XXXXXX'
  private rdmPattern: string = '0100001101000XXX'
  private rnPattern: string = '0100001101XXX000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 3)
    if (options[0] !== options[2]) {
      throw new Error(
        'first and third parameter must be the same register (Rdm = Rn * Rdm)'
      )
    }
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdmPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let rdmRegister = getBits(opcode, this.rdmPattern).value
    let aluResult: AluResult = mul(
      registers.readRegister(rdmRegister),
      registers.readRegister(getBits(opcode, this.rnPattern).value)
    )
    registers.writeRegister(rdmRegister, aluResult.result)
    registers.setFlags(aluResult.flags)
  }
}
