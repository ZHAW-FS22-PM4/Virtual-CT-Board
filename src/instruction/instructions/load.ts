import { Halfword, Word } from 'types/binary'
import {
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  createRegisterBits,
  getBits,
  isImmediate,
  isOptionCountValid, registerStringHasBrackets, removeBracketsFromRegisterString,
  setBits
} from 'instruction/opcode'
import { Register, Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'

import { ILabelOffsets } from '../interfaces'
import { BaseInstruction } from './baseInstruction'

/**
 * Represents a 'LOAD' instruction - LDR (immediate offset) - word
 */
export class LoadInstructionImmediateOffset extends BaseInstruction {
  public name: string = 'LDR'
  public pattern: string = '01101XXXXXXXXXXX'
  private rnPattern: string = '0110100000XXX000'
  private rtPattern: string = '0110100000000XXX'
  private immPattern: string = '01101XXXXX000000'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    if (super.canEncodeInstruction(commandName, options)) {
      if (
        isOptionCountValid(options, this.expectedOptionCount) &&
        isImmediate(options[2]) &&
        registerStringHasBrackets(options[1],options[2])
      ) {
        return true
      }
    }
    return false
  }
  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[0])))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[1])))
    opcode = setBits(opcode, this.immPattern, createImmediateBits(removeBracketsFromRegisterString(options[2]),5))
    return opcode
  }
  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
      registers.writeRegister((getBits(opcode,this.rtPattern).value), memory.readWord(registers.readRegister(getBits(opcode,this.rnPattern).value).add(
        Word.fromUnsignedInteger(getBits(opcode,this.immPattern).value))))
  }
}


/**
 * Represents a 'LOAD' instruction - LDR (register offset) - word
 */
export class LoadInstructionRegisterOffset extends BaseInstruction {
  public name: string = 'LDR'
  public pattern: string = '0101100XXXXXXXXX'
  private rnPattern: string = '0101100000XXX000'
  private rmPattern: string = '0101100XXX000000'
  private rtPattern: string = '0101100000000XXX'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    if (super.canEncodeInstruction(commandName, options)) {
      if (
        isOptionCountValid(options, this.expectedOptionCount) &&
        !isImmediate(options[2]) &&
        registerStringHasBrackets(options[1],options[2])
      ) {
        return true
      }
    }
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[0])))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[1])))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[2])))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister((getBits(opcode,this.rtPattern).value), memory.readWord(registers.readRegister(getBits(opcode,this.rnPattern).value).add(
      registers.readRegister(getBits(opcode,this.rmPattern).value))))

  }
}



/**
 * Represents a 'LOAD' instruction - LDR (pointer + offset) - word
 */
export class LoadInstructionPointerOffset extends BaseInstruction {
  public name: string = 'LDR'
  public pattern: string = '0100100XXXXXXXXX'
  private immPattern: string = '01001000XXXXXXXX'
  private rtPattern: string =  '01001XXX00000000'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    if (super.canEncodeInstruction(commandName, options)) {
      if (
        isOptionCountValid(options, this.expectedOptionCount) &&
        isImmediate(options[2]) &&
        registerStringHasBrackets(options[1],options[2]) &&
        'PC' ===  removeBracketsFromRegisterString(options[1])
      ) {
        return true
      }
    }
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[0])))
    opcode = setBits(opcode, this.immPattern, createImmediateBits(removeBracketsFromRegisterString(options[2]),8))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister((getBits(opcode,this.rtPattern).value), memory.readWord(registers.readRegister(getBits(opcode,this.immPattern).value).add(Register.PC)))
  }
}


/**
 * Represents a 'LOAD' instruction - LDRB (register offset) - byte
 */
export class LoadInstructionRegisterOffsetByte extends BaseInstruction {
  public name: string = 'LDRB'
  public pattern: string = '0101110XXXXXXXXX'
  private rnPattern: string = '0101110000XXX000'
  private rmPattern: string = '0101110XXX000000'
  private rtPattern: string = '0101110000000XXX'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    if (super.canEncodeInstruction(commandName, options)) {
      if (
        isOptionCountValid(options, this.expectedOptionCount) &&
        !isImmediate(options[2]) &&
        registerStringHasBrackets(options[1],options[2])
      ) {
        return true
      }
    }
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[0])))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[1])))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[2])))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister((getBits(opcode,this.rtPattern).value),Word.fromBytes(memory.readByte(registers.readRegister(getBits(opcode,this.rnPattern).value).add(
      registers.readRegister(getBits(opcode,this.rmPattern).value)))) )

  }
}


/**
 * Represents a 'LOAD' instruction - LDRB (immediate offset) - byte
 */
export class LoadInstructionImmediateOffsetByte extends BaseInstruction {
  public name: string = 'LDRB'
  public pattern: string =     '01111XXXXXXXXXXX'
  private rnPattern: string =  '0111100000XXX000'
  private rtPattern: string =  '0111100000000XXX'
  private immPattern: string = '01111XXXXX000000'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    if (super.canEncodeInstruction(commandName, options)) {
      if (
        isOptionCountValid(options, this.expectedOptionCount) &&
        isImmediate(options[2]) &&
        registerStringHasBrackets(options[1],options[2])
      ) {
        return true
      }
    }
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[0])))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[1])))
    opcode = setBits(opcode, this.immPattern, createImmediateBits(removeBracketsFromRegisterString(options[2]),5))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister((getBits(opcode,this.rtPattern).value), Word.fromBytes(memory.readByte(registers.readRegister(getBits(opcode,this.rnPattern).value).add(
      Word.fromUnsignedInteger(getBits(opcode,this.immPattern).value)))))
  }
}


/**
 * Represents a 'LOAD' instruction - LDRH (register offset) - halfword
 */
export class LoadInstructionRegisterOffsetHalfword extends BaseInstruction {
  public name: string = 'LDRH'
  public pattern: string = '0101101XXXXXXXXX'
  private rnPattern: string = '0101101000XXX000'
  private rmPattern: string = '0101101XXX000000'
  private rtPattern: string = '0101101000000XXX'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    if (super.canEncodeInstruction(commandName, options)) {
      if (
        isOptionCountValid(options, this.expectedOptionCount) &&
        !isImmediate(options[2]) &&
        registerStringHasBrackets(options[1],options[2])
      ) {
        return true
      }
    }
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[0])))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[1])))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[2])))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister((getBits(opcode,this.rtPattern).value),Word.fromHalfwords(memory.readHalfword(registers.readRegister(getBits(opcode,this.rnPattern).value).add(
      registers.readRegister(getBits(opcode,this.rmPattern).value)))) )

  }
}
/**
 * Represents a 'LOAD' instruction - LDRH (immediate offset) - halfword
 */
export class LoadInstructionImmediateOffsetHalfword extends BaseInstruction {
  public name: string = 'LDRH'
  public pattern: string = '10001XXXXXXXXXXX'
  private rnPattern: string = '1000100000XXX000'
  private rtPattern: string = '1000100000000XXX'
  private immPattern: string = '10001XXXXX000000'
  private expectedOptionCount: number = 3

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    if (super.canEncodeInstruction(commandName, options)) {
      if (
        isOptionCountValid(options, this.expectedOptionCount) &&
        isImmediate(options[2]) &&
        registerStringHasBrackets(options[1],options[2])
      ) {
        return true
      }
    }
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[0])))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(removeBracketsFromRegisterString(options[1])))
    opcode = setBits(opcode, this.immPattern, createImmediateBits(removeBracketsFromRegisterString(options[2]),5))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister((getBits(opcode,this.rtPattern).value), Word.fromHalfwords(memory.readHalfword(registers.readRegister(getBits(opcode,this.rnPattern).value).add(
      Word.fromUnsignedInteger(getBits(opcode,this.immPattern).value)))))
  }
}