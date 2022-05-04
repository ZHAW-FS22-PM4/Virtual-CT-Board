import { evaluateZeroAndNegativeFlags } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import {
  checkOptionCount,
  create,
  createLowRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { convertToUnsignedNumber } from 'types/binary/utils'
import { BaseInstruction } from '../base'

/**
 * Represents a 'Compare and Test' instruction - TST
 */
export class TstInstruction extends BaseInstruction {
  public name: string = 'TST'
  public pattern: string = '0100001000XXXXXX'
  private rnPattern: string = '0100001000000XXX'
  private rmPattern: string = '0100001000XXX000'

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 2)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[0]))
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let calculatedValue = Word.fromUnsignedInteger(
      convertToUnsignedNumber(
        registers
          .readRegister(getBits(opcode[0], this.rnPattern).value)
          .toUnsignedInteger() &
          registers
            .readRegister(getBits(opcode[0], this.rmPattern).value)
            .toUnsignedInteger()
      )
    )

    registers.setFlags(evaluateZeroAndNegativeFlags(calculatedValue))
  }
}
