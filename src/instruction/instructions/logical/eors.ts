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
 * Represents a 'Exclusive OR' instruction - EORS
 */
export class EorsInstruction extends BaseInstruction {
  public name: string = 'EORS'
  public pattern: string = '0100000001XXXXXX'
  private rdnPattern: string = '0100000001000XXX'
  private rmPattern: string = '0100000001XXX000'

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

  public executeInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let calculatedValue = Word.fromUnsignedInteger(
      convertToUnsignedNumber(
        registers
          .readRegister(getBits(opcode[0], this.rdnPattern).value)
          .toUnsignedInteger() ^
          registers
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
