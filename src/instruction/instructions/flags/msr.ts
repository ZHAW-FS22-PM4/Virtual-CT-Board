import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import {
  checkOptionCount,
  create,
  createRegisterBits,
  setBits
} from 'instruction/opcode'
import { Halfword } from 'types/binary'
import { BaseInstruction } from '../base'

export class MsrInstruction extends BaseInstruction {
  public name: string = 'MSR'
  public pattern: string = '111100111000XXXX'
  private patternSecondHalf: string = '1000100000000000'

  public encodeInstruction (options: string[]): Halfword[] {
    checkOptionCount(options, 2)
    if (options[0] !== 'APSR') {
      throw new Error("Parameter 1 must be 'APSR'!")
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

  protected onExecuteInstruction (
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    throw new Error('Method not implemented.')
  }
}
