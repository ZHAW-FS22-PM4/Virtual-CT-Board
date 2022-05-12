import { evaluateZeroAndNegativeFlags } from 'board/alu'
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
import { Halfword, Word } from 'types/binary'
import { convertToUnsignedNumber } from 'types/binary/utils'
import { BaseInstruction } from '../base'

/**
 * Represents a 'Bit Clear' instruction - BICS
 */
export class BicsInstruction extends BaseInstruction {
  public name: string = 'BICS'
  public pattern: string = '0100001110XXXXXX'
  private rdnPattern: string = '0100001110000XXX'
  private rmPattern: string = '0100001110XXX000'

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 2, 3)
    if (options.length == 3 && options[0] !== options[1])
      throw new InstructionError('Parameter 1 and 2 must be identical.')

    let opcode: Halfword = create(this.pattern)
    let rmBits: Halfword = createLowRegisterBits(options[options.length - 1])

    opcode = setBits(opcode, this.rmPattern, rmBits)
    opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))

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
          .readRegister(getBits(opcode[0], this.rdnPattern).value)
          .toUnsignedInteger() &
          ~registers
            .readRegister(getBits(opcode[0], this.rmPattern).value)
            .toUnsignedInteger()
      )
    )

    registers.setFlags(evaluateZeroAndNegativeFlags(calculatedValue))
    registers.writeRegister(
      getBits(opcode[0], this.rdnPattern).value,
      calculatedValue
    )
  }
}
