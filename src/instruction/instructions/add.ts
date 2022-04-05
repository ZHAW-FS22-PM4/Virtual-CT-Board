import { Halfword, Word } from 'types/binary'
import { Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'
import {
  checkOptionCount,
  create,
  createRegisterBits,
  createLowRegisterBits,
  getBits,
  setBits,
  createImmediateBits
} from 'instruction/opcode'

import { ILabelOffsets } from '../interfaces'
import { BaseInstruction } from './baseInstruction'
import { add, AluResult } from 'board/alu'

/**
 * Class for ADD instruction adding two register values.
 */
export class AddInstruction extends BaseInstruction {
  public name: string = 'ADD'
  public pattern: string = '01000100XXXXXXXX'
  private rdnPattern: string = '01000100X0000XXX'
  private rmPattern: string = '010001000XXXX000'

  public encodeInstruction (
    options: string[],
    labels: ILabelOffsets
  ): Halfword {
    checkOptionCount(options, 2)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdnPattern, createRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createRegisterBits(options[1]))
    return opcode
  }

  public executeInstruction (
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let rdnRegister: number = getBits(opcode, this.rdnPattern).value
    let rmRegister: number = getBits(opcode, this.rmPattern).value

    let rdnRegisterContent: Word = registers.readRegister(rdnRegister)
    let rmRegisterContent: Word = registers.readRegister(rmRegister)

    let aluResult: AluResult = add(rdnRegisterContent, rmRegisterContent)

    registers.writeRegister(rdnRegister, aluResult.result)
    registers.setFlags(aluResult.flags)
  }
}

/**
 * Class for ADDS instruction adding 2 register values.
 */
export class AddsRegistersInstruction extends BaseInstruction {
  public name: string = 'ADDS'
  public pattern: string = '0001100XXXXXXXXX'
  private rdPattern: string = '0001100000000XXX'
  private rnPattern: string = '0001100000XXX000'
  private rmPattern: string = '0001100XXX000000'

  public encodeInstruction (
    options: string[],
    labels: ILabelOffsets
  ): Halfword {
    checkOptionCount(options, 3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[2]))
    return opcode
  }

  public executeInstruction (
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let rnRegister: number = getBits(opcode, this.rnPattern).value
    let rmRegister: number = getBits(opcode, this.rmPattern).value
    let rdRegister: number = getBits(opcode, this.rdPattern).value

    let rnRegisterContent: Word = registers.readRegister(rnRegister)
    let rmRegisterContent: Word = registers.readRegister(rmRegister)

    let aluResult: AluResult = add(rnRegisterContent, rmRegisterContent)

    registers.writeRegister(rdRegister, aluResult.result)
    registers.setFlags(aluResult.flags)
  }
}

/**
 * Class for ADDS instruction adding a register value and an immediate value.
 */
export class AddsImmediate3Instruction extends BaseInstruction {
  public name: string = 'ADDS'
  public pattern: string = '0001110XXXXXXXXX'
  private rdPattern: string = '0001110000000XXX'
  private rnPattern: string = '0001110000XXX000'
  private immPattern: string = '0001110XXX000000'

  public encodeInstruction (
    options: string[],
    labels: ILabelOffsets
  ): Halfword {
    checkOptionCount(options, 3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    opcode = setBits(
      opcode,
      this.immPattern,
      createImmediateBits(options[2], 3)
    )
    return opcode
  }

  public executeInstruction (
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let rnRegister: number = getBits(opcode, this.rnPattern).value
    let rdRegister: number = getBits(opcode, this.rdPattern).value

    let immValue: Word = Word.fromHalfwords(getBits(opcode, this.immPattern))
    let rnRegisterContent: Word = registers.readRegister(rnRegister)

    let aluResult: AluResult = add(rnRegisterContent, immValue)

    registers.writeRegister(rdRegister, aluResult.result)
    registers.setFlags(aluResult.flags)
  }
}

/**
 * Class for ADDS instruction adding an immediate and a register value and
 * storing it in the same register.
 */
export class AddsImmediate8Instruction extends BaseInstruction {
  public name: string = 'ADDS'
  public pattern: string = '00110XXXXXXXXXXX'
  private rdnPattern: string = '00110XXX00000000'
  private immPattern: string = '00110000XXXXXXXX'

  public encodeInstruction (
    options: string[],
    labels: ILabelOffsets
  ): Halfword {
    checkOptionCount(options, 2)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(
      opcode,
      this.immPattern,
      createImmediateBits(options[1], 8)
    )
    return opcode
  }

  public executeInstruction (
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let rdnRegister: number = getBits(opcode, this.rdnPattern).value
    let immValue: Word = Word.fromHalfwords(getBits(opcode, this.immPattern))

    let rdnRegisterContent: Word = registers.readRegister(rdnRegister)

    let aluResult: AluResult = add(rdnRegisterContent, immValue)

    registers.writeRegister(rdnRegister, aluResult.result)
    registers.setFlags(aluResult.flags)
  }
}
