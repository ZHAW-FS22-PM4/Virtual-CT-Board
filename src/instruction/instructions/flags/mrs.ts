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

export class MrsInstruction extends BaseInstruction {
  public name: string = 'MRS'
  public pattern: string = '1111001111101111'
  private patternSecondHalf: string = '1000XXXX00000000'

  public encodeInstruction (options: string[]): Halfword[] {
    checkOptionCount(options, 2)
    if (options[1] !== 'APSR') {
      throw new Error("Parameter 2 must be 'APSR'!")
    }
    let opcodeFirstPart: Halfword = create(this.pattern)
    let opcodeSecondPart: Halfword = create(this.patternSecondHalf)
    opcodeSecondPart = setBits(
      opcodeSecondPart,
      this.patternSecondHalf,
      createRegisterBits(options[0])
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
