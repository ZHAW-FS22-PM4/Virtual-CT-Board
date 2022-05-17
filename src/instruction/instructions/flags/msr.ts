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
 * Represents MSR instruction that manipulates APSR status register (flags).
 */
export class MsrInstruction extends BaseInstruction {
  public name: string = 'MSR'
  public pattern: string = '111100111000XXXX'
  private patternSecondHalf: string = '1000100000000000'
  public opcodeLength: number = 2

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 2)
    if (options[0] !== 'APSR') {
      throw new Error(
        "Param 1 must be 'APSR' since no other status registers are available."
      )
    }
    let opcodeFirstPart: Halfword = create(this.pattern)
    let opcodeSecondPart: Halfword = create(this.patternSecondHalf)
    opcodeFirstPart = setBits(
      opcodeFirstPart,
      this.pattern,
      createRegisterBits(options[1])
    )
    return [opcodeFirstPart, opcodeSecondPart]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let rdRegister: number = getBits(opcode[0], this.pattern).value
    let rdRegisterContent: number = registers.readRegister(rdRegister).value
    // only bits[31:28] are relevant
    let apsrContent: Word = Word.fromSignedInteger(
      (rdRegisterContent >>> 28) << 28
    )
    registers.writeRegister(Register.APSR, apsrContent)
  }
}
