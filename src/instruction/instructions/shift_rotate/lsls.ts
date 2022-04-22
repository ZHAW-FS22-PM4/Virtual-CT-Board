import { evaluateZeroAndNegativeFlags } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Flag, Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  getBits,
  isImmediate,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'

export class LslsRegisterInstruction extends BaseInstruction {
  public name: string = 'LSLS'
  public pattern: string = '0100000010XXXXXX'
  private rdnPattern: string = '0100000010000XXX'
  private rmPattern: string = '0100000010XXX000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 2, 3)
    if (options.length == 3 && options[0] !== options[1])
      throw new Error('Parameter 1 and 2 must be identical!')
    let opcode: Halfword = create(this.pattern)
    let rmBits: Halfword = createLowRegisterBits(options[options.length - 1])
    opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, rmBits)
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

    let result: Word =
      rmValue.value < Word.NUMBER_OF_BITS
        ? Word.fromSignedInteger(rdnValue.value << rmValue.value)
        : Word.fromUnsignedInteger(0x00)

    let isCarrySet: boolean = false
    if (rmValue.value <= Word.NUMBER_OF_BITS && rmValue.value > 0) {
      isCarrySet = rdnValue.isBitSet(Word.NUMBER_OF_BITS - rmValue.value)
    }

    registers.writeRegister(rdnBits.value, result)
    registers.setFlags(evaluateZeroAndNegativeFlags(result))
    registers.setFlags({ C: isCarrySet })
  }

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(commandName, options) &&
      options.every((x) => !isImmediate(x))
    )
  }
}

export class LslsImmediateInstruction extends BaseInstruction {
  public name: string = 'LSLS'
  public pattern: string = '00000XXXXXXXXXXX'
  private rdPattern: string = '0000000000000XXX'
  private rmPattern: string = '0000000000XXX000'
  private immPattern: string = '00000XXXXX000000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 2, 3)

    let opcode: Halfword = create(this.pattern)
    let immBits: Halfword = createImmediateBits(options[options.length - 1], 5)

    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.immPattern, immBits)
    opcode =
      options.length == 3
        ? setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
        : setBits(opcode, this.rmPattern, createLowRegisterBits(options[0]))

    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let rdBits = getBits(opcode, this.rdPattern)
    let rmBits = getBits(opcode, this.rmPattern)
    let rmValue: Word = registers.readRegister(rmBits.value)
    let immValue: Word = Word.fromHalfwords(getBits(opcode, this.immPattern))

    let result = Word.fromSignedInteger(rmValue.value << immValue.value)
    let isCarrySet: boolean =
      immValue.value > 0
        ? rmValue.isBitSet(Word.NUMBER_OF_BITS - immValue.value)
        : registers.isFlagSet(Flag.C)

    registers.writeRegister(rdBits.value, result)
    registers.setFlags(evaluateZeroAndNegativeFlags(result))
    registers.setFlags({ C: isCarrySet })
  }

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(commandName, options) &&
      isImmediate(options[options.length - 1])
    )
  }
}
