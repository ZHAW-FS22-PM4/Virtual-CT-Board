import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createLowRegisterBits,
  getBits,
  isImmediate,
  isOptionCountValid,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { evaluateZeroAndNegativeFlags } from '../../../board/alu'
import { BaseInstruction } from '../base'
import {convertToUnsignedNumber} from "../../../types/binary/utils";

/**
 * Represents a 'Compare and Test' instruction - TST
 */
export class TstInstruction extends BaseInstruction {
  public name: string = 'TST'
  public pattern: string = '0100001000XXXXXX'
  private rnPattern: string = '0100001000000XXX'
  private rmPattern: string = '0100001000XXX000'

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
        super.canEncodeInstruction(name, options) &&
        isOptionCountValid(options, 2,3) &&
        options.every((x) => !isImmediate(x))
    )
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 2)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[0]))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let calculatedValue = Word.fromUnsignedInteger(convertToUnsignedNumber(
      registers
        .readRegister(getBits(opcode, this.rnPattern).value)
        .toUnsignedInteger() &
        registers
          .readRegister(getBits(opcode, this.rmPattern).value)
          .toUnsignedInteger())
    )

    registers.setFlags(evaluateZeroAndNegativeFlags(calculatedValue))
  }
}
