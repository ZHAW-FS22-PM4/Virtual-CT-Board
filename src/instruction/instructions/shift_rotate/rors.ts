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
import { BaseInstruction } from '../base'

export class RorsInstruction extends BaseInstruction {
  public name: string = 'RORS'
  public pattern: string = '0100000111XXXXXX'
  private rdnPattern: string = '0100000111000XXX'
  private rmPattern: string = '0100000111XXX000'

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 2, 3)
    if (options.length === 3 && options[0] !== options[1])
      throw new InstructionError('Parameter 1 and 2 must be identical.')
    let opcode: Halfword = create(this.pattern)
    let rmBits: Halfword = createLowRegisterBits(options[options.length - 1])
    opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, rmBits)
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let rdnBits = getBits(opcode[0], this.rdnPattern)
    let rmBits = getBits(opcode[0], this.rmPattern)
    let rdnValue: Word = registers.readRegister(rdnBits.value)
    let rmValue: Word = registers.readRegister(rmBits.value)

    let shiftByBit: number = rmValue.value % Word.NUMBER_OF_BITS
    let shift =
      (rdnValue.value >>> shiftByBit) |
      (rdnValue.value << (Word.NUMBER_OF_BITS - shiftByBit))

    let result: Word = Word.fromSignedInteger(shift)
    let isCarrySet: boolean =
      rmValue.value !== 0 ? result.isBitSet(Word.NUMBER_OF_BITS - 1) : false

    registers.writeRegister(rdnBits.value, result)
    registers.setFlags(evaluateZeroAndNegativeFlags(result))
    registers.setFlags({ C: isCarrySet })
  }
}
