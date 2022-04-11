import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import {
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  createRegisterBits,
  getBits,
  isImmediate,
  isOptionCountValid,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { ILabelOffsets } from '../interfaces'
import { BaseInstruction } from './baseInstruction'

/**
 * Represents a 'MOV' instruction.
 */
export class MovInstruction extends BaseInstruction {
  public name: string = 'MOV'
  public pattern: string = '01000110XXXXXXXX'
  private rdPattern: string = '01000110X0000XXX'
  private rmPattern: string = '010001100XXXX000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 2)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createRegisterBits(options[1]))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister(
      getBits(opcode, this.rdPattern).value,
      registers.readRegister(getBits(opcode, this.rmPattern).value)
    )
  }
}

/**
 * Represents a 'MOVS' instruction, getting a value from a register.
 */
export class MovsFromRegisterInstruction extends BaseInstruction {
  public name: string = 'MOVS'
  public pattern: string = '0000000000XXXXXX'
  private rdPattern: string = '0000000000000XXX'
  private rmPattern: string = '0000000000XXX000'
  private expectedOptionCount: number = 2

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    if (super.canEncodeInstruction(commandName, options)) {
      if (
        options.length != this.expectedOptionCount ||
        !isImmediate(options[1])
      ) {
        //take in all instructions except the one with immediate on second option
        return true
      }
    }
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, this.expectedOptionCount)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let valueToWrite = registers.readRegister(
      getBits(opcode, this.rmPattern).value
    )
    registers.setNegativeFlag(valueToWrite)
    registers.setZeroFlag(valueToWrite.value)
    registers.writeRegister(getBits(opcode, this.rdPattern).value, valueToWrite)
  }
}

/**
 * Represents a 'MOVS' instruction, getting a value from a literal.
 */
export class MovsFromLiteralInstruction extends BaseInstruction {
  public name: string = 'MOVS'
  public pattern: string = '00100XXXXXXXXXXX'
  private rdPattern: string = '00100XXX00000000'
  private immPattern: string = '00100000XXXXXXXX'
  private expectedOptionCount: number = 2

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    if (super.canEncodeInstruction(commandName, options)) {
      if (
        isOptionCountValid(options, this.expectedOptionCount) &&
        isImmediate(options[1])
      ) {
        return true
      }
    }
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, this.expectedOptionCount)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(
      opcode,
      this.immPattern,
      createImmediateBits(options[1], 8)
    )
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let valueToWrite = Word.fromHalfwords(getBits(opcode, this.immPattern))
    registers.setNegativeFlag(valueToWrite)
    registers.setZeroFlag(valueToWrite.value)
    registers.writeRegister(getBits(opcode, this.rdPattern).value, valueToWrite)
  }
}
