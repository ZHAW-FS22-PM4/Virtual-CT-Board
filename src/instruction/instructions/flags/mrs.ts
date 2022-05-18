import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import {
  checkOptionCount,
  create,
  createRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'

/**
 * Represents MRS instruction that copies flags from APSR status register.
 */
export class MrsInstruction extends BaseInstruction {
  public name: string = 'MRS'
  public pattern: string = '1111001111101111'
  public patternSecondPart: string = '1000XXXX00000000'
  public opcodeLength: number = 2

  public encodeInstruction (options: string[]): Halfword[] {
    checkOptionCount(options, 2)
    if (options[1] !== 'APSR') {
      throw new Error(
        "Param 2 must be 'APSR' since no other status registers are available."
      )
    }
    let opcodeFirstPart: Halfword = create(this.pattern)
    let opcodeSecondPart: Halfword = create(this.patternSecondPart)
    opcodeSecondPart = setBits(
      opcodeSecondPart,
      this.patternSecondPart,
      createRegisterBits(options[0])
    )
    return [opcodeFirstPart, opcodeSecondPart]
  }

  protected onExecuteInstruction (
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let rdRegister: number = getBits(opcode[1], this.patternSecondPart).value
    let apsrContent: Word = registers.readRegister(Register.APSR)
    registers.writeRegister(rdRegister, apsrContent)
  }
}
