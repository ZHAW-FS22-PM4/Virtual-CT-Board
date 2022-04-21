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
 * Represents a 'Exclusive OR' instruction - EORS
 */
export class EorsInstruction extends BaseInstruction {
  public name: string = 'EORS'
  public pattern: string = '0100000001XXXXXX'
  private rdnPattern: string = '0100000001000XXX'
  private rmPattern: string = '0100000001XXX000'

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
        super.canEncodeInstruction(name, options) &&
        isOptionCountValid(options, 2,3) &&
        options.every((x) => !isImmediate(x))
    )
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 2,3)
    let opcode: Halfword = create(this.pattern)
    let rmBits: Halfword = createLowRegisterBits(options[options.length - 1])
    opcode = setBits(opcode, this.rmPattern, rmBits)
    opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let calculatedValue = Word.fromUnsignedInteger(convertToUnsignedNumber(
        registers
        .readRegister(getBits(opcode, this.rdnPattern).value)
        .toUnsignedInteger() ^
        registers
          .readRegister(getBits(opcode, this.rmPattern).value)
          .toUnsignedInteger())
    )

    registers.setFlags(evaluateZeroAndNegativeFlags(calculatedValue))
    registers.writeRegister(
      getBits(opcode, this.rdnPattern).value,
      calculatedValue
    )
  }
}
