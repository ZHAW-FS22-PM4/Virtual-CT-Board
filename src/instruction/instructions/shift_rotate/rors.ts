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
import { BaseInstruction } from '../base'

export class RorsInstruction extends BaseInstruction {
  public name: string = 'RORS'
  public pattern: string = '0100000111XXXXXX'
  private rdnPattern: string = '0100000111000XXX'
  private rmPattern: string = '0100000111XXX000'
  private expectedOptionCount: number = 3

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, this.expectedOptionCount)
    if (options[0] !== options[1])
      throw new Error('Parameter 1 and 2 must be identical!')
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[2]))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let rdnBits = getBits(opcode, this.rdnPattern)
    let rmBits = getBits(opcode, this.rmPattern)
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

    registers.setFlags({
      N: result.hasSign(),
      Z: result.toUnsignedInteger() === 0,
      C: isCarrySet
    })
  }

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(this.name, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      options[0] == options[1] &&
      options.every((x) => !isImmediate(x))
    )
  }
}
