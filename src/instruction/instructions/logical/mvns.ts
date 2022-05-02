import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createLowRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { evaluateZeroAndNegativeFlags } from '../../../board/alu'
import { convertToUnsignedNumber } from '../../../types/binary/utils'
import { BaseInstruction } from '../base'

/**
 * Represents a 'Bitwise NOT' instruction - MVNS
 */
export class MvnsInstruction extends BaseInstruction {
  public name: string = 'MVNS'
  public pattern: string = '0100001111XXXXXX'
  private rdPattern: string = '0100001111000XXX'
  private rmPattern: string = '0100001111XXX000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 2)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let calculatedValue = Word.fromUnsignedInteger(
      convertToUnsignedNumber(
        ~registers
          .readRegister(getBits(opcode, this.rmPattern).value)
          .toUnsignedInteger()
      )
    )

    registers.setFlags(evaluateZeroAndNegativeFlags(calculatedValue))
    registers.writeRegister(
      getBits(opcode, this.rdPattern).value,
      calculatedValue
    )
  }
}
