import { Halfword, Word } from 'types/binary'
import {
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  createRegisterBits,
  getBits,
  isImmediate,
  setBits
} from 'instruction/opcode'
import { Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'

import { ILabelOffsets, IInstruction } from '../interfaces'

/**
 * Represents a 'MOV' instruction.
 */
export class MovInstruction implements IInstruction {
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
export class MovsFromRegisterInstruction implements IInstruction {
  public name: string = 'MOVS_withRegister' // so it never matches as encoder (gets called by child if needed)
  public pattern: string = '0000000000XXXXXX'
  private rdPattern: string = '0000000000000XXX'
  private rmPattern: string = '0000000000XXX000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    //never called directly but from child method if no immediate is provided
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
export class MovsFromLiteralInstruction extends MovsFromRegisterInstruction {
  public name: string = 'MOVS'
  public pattern: string = '00100XXXXXXXXXXX'
  private rdLiteralPattern: string = '00100XXX00000000'
  private immPattern: string = '00100000XXXXXXXX'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 2)
    if (!isImmediate(options[1])) {
      //use MovsFromRegisterInstruction if second option is also a register
      return super.encodeInstruction(options, labels)
    }
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(
      opcode,
      this.rdLiteralPattern,
      createLowRegisterBits(options[0])
    )
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
    registers.writeRegister(
      getBits(opcode, this.rdLiteralPattern).value,
      valueToWrite
    )
  }
}
