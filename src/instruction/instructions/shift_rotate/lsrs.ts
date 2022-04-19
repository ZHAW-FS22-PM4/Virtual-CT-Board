import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  getBits,
  isImmediate,
  isOptionCountValid,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'

export class LsrsRegisterInstruction extends BaseInstruction {
  public name: string = 'LSRS'
  public pattern: string = '0100000011XXXXXX'
  private rdnPattern: string = '0100000011000XXX'
  private rmPattern: string = '0100000011XXX000'
  private expectedOptionCount: number = 3

  public encodeInstruction (
    options: string[],
    labels: ILabelOffsets
  ): Halfword {
    checkOptionCount(options, this.expectedOptionCount)
    if (options[0] !== options[1])
      throw new Error('Parameter 1 and 2 must be identical!')
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[2]))
    return opcode
  }

  public executeInstruction (
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let rdnBits = getBits(opcode, this.rdnPattern)
    let rmBits = getBits(opcode, this.rmPattern)
    let rdnValue: Word = registers.readRegister(rdnBits.value)
    let rmValue: Word = registers.readRegister(rmBits.value)

    let shift = Word.fromUnsignedInteger(rdnValue.value >>> rmValue.value)
    let result =
      rmValue.value < Word.NUMBER_OF_BITS
        ? shift
        : Word.fromUnsignedInteger(0x00)
    let isCarrySet: boolean =
      rmValue.value <= Word.NUMBER_OF_BITS && rmValue.value > 0
        ? rdnValue.isBitSet(rmValue.value - 1)
        : false

    registers.writeRegister(rdnBits.value, result)

    registers.setFlags({
      N: result.hasSign(),
      Z: result.toUnsignedInteger() === 0,
      C: isCarrySet
    })
  }

  public canEncodeInstruction (
    commandName: string,
    options: string[]
  ): boolean {
    return (
      super.canEncodeInstruction(commandName, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      options[0] == options[1] &&
      options.every((x) => !isImmediate(x))
    )
  }
}

export class LsrsImmediateInstruction extends BaseInstruction {
  public name: string = 'LSRS'
  public pattern: string = '00001XXXXXXXXXXX'
  private rdPattern: string = '0000100000000XXX'
  private rmPattern: string = '0000100000XXX000'
  private immPattern: string = '00001XXXXX000000'
  private expectedOptionCount: number = 3

  public encodeInstruction (
    options: string[],
    labels: ILabelOffsets
  ): Halfword {
    checkOptionCount(options, this.expectedOptionCount)
    let opcode: Halfword = create(this.pattern)
    let immBits = createImmediateBits(options[2], 5)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.immPattern, immBits)
    return opcode
  }

  public executeInstruction (
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let rdBits = getBits(opcode, this.rdPattern)
    let rmBits = getBits(opcode, this.rmPattern)
    let rmValue: Word = registers.readRegister(rmBits.value)
    let immValue: Word = Word.fromHalfwords(getBits(opcode, this.immPattern))

    if (immValue.value === 0) {
      throw new Error('Zero is not allowed as immediate in an LSRS operation!')
    }

    let shift = rmValue.value >>> immValue.value
    let result = Word.fromUnsignedInteger(shift)
    let isCarrySet: boolean =
      immValue.value > 0 ? rmValue.isBitSet(immValue.value - 1) : false

    registers.writeRegister(rdBits.value, result)

    registers.setFlags({
      N: result.hasSign(),
      Z: result.toUnsignedInteger() === 0,
      C: isCarrySet
    })
  }

  public canEncodeInstruction (
    commandName: string,
    options: string[]
  ): boolean {
    return (
      super.canEncodeInstruction(commandName, options) &&
      isOptionCountValid(options, this.expectedOptionCount) &&
      isImmediate(options[2])
    )
  }
}
