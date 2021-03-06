import { evaluateZeroAndNegativeFlags } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
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

export class LsrsRegisterInstruction extends BaseInstruction {
  public name: string = 'LSRS'
  public pattern: string = '0100000011XXXXXX'
  private rdnPattern: string = '0100000011000XXX'
  private rmPattern: string = '0100000011XXX000'

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
    registers.setFlags(evaluateZeroAndNegativeFlags(result))
    registers.setFlags({ C: isCarrySet })
  }

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
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
  protected instrWithSameName: BaseInstruction[] = [
    new LsrsRegisterInstruction()
  ]

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 2, 3)
    let opcode: Halfword = create(this.pattern)
    let immBits = createImmediateBits(options[options.length - 1], 5)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.immPattern, immBits)
    opcode =
      options.length === 3
        ? setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
        : setBits(opcode, this.rmPattern, createLowRegisterBits(options[0]))
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let rdBits = getBits(opcode[0], this.rdPattern)
    let rmBits = getBits(opcode[0], this.rmPattern)
    let rmValue: Word = registers.readRegister(rmBits.value)
    let immValue: Word = Word.fromHalfwords(getBits(opcode[0], this.immPattern))

    if (immValue.value === 0) {
      throw new InstructionError(
        'Zero is not allowed as immediate in an LSRS operation.'
      )
    }

    let shift = rmValue.value >>> immValue.value
    let result = Word.fromUnsignedInteger(shift)
    let isCarrySet: boolean =
      immValue.value > 0 ? rmValue.isBitSet(immValue.value - 1) : false

    registers.writeRegister(rdBits.value, result)
    registers.setFlags(evaluateZeroAndNegativeFlags(result))
    registers.setFlags({ C: isCarrySet })
  }
}
