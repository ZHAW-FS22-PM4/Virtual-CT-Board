import { Halfword, Word } from 'types/binary'
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
import { Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'

import { ILabelOffsets } from '../interfaces'
import { BaseInstruction } from './baseInstruction'

/**
 * Represents a 'STORE' instruction - STR (immediate offset) - word
 */
export class StoreInstructionImmediateOffset extends BaseInstruction {
  public name: string = 'STR'
  public pattern: string = '01100XXXXXXXXXXX'
  private rnPattern: string = '0110000000XXX000'
  private rtPattern: string = '0110000000000XXX'
  private immPattern: string = '01100XXXXX000000'

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    // todo
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.immPattern, createImmediateBits(options[2],5))
    return opcode
  }

  public executeInstruction(
      opcode: Halfword,
      registers: Registers,
      memory: IMemory
  ): void {
    memory.writeWord(
        registers.readRegister(getBits(opcode,this.rnPattern).value).add(
            Word.fromUnsignedInteger(getBits(opcode,this.immPattern).value)
        ),
        registers.readRegister(getBits(opcode,this.rtPattern).value)
    )
  }
}


/**
 * Represents a 'STORE' instruction - STR (register offset) - word
 */
export class StoreInstructionRegisterOffset extends BaseInstruction {
  public name: string = 'STR'
  public pattern: string = '0101000XXXXXXXXX'
  private rnPattern: string = '0101000000XXX000'
  private rmPattern: string = '0101000XXX000000'
  private rtPattern: string = '0101000000000XXX'

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    // todo
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[2]))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    memory.writeWord(
      registers.readRegister(getBits(opcode,this.rnPattern).value).add(
        registers.readRegister(getBits(opcode,this.rmPattern).value)
      ),
      registers.readRegister(getBits(opcode,this.rtPattern).value)
    )
  }
}







/**
 * Represents a 'STORE' instruction - STR (immediate offset) - halfword
 */
export class StoreInstructionImmediateOffsetHalfword extends BaseInstruction {
  public name: string = 'STR'
  public pattern: string = '01100XXXXXXXXXXX'
  private rnPattern: string = '0110000000XXX000'
  private rtPattern: string = '0110000000000XXX'
  private immPattern: string = '01100XXXXX000000'

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    // todo
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.immPattern, createImmediateBits(options[2],5))
    return opcode
  }

  public executeInstruction(
      opcode: Halfword,
      registers: Registers,
      memory: IMemory
  ): void {
    memory.writeWord(
        registers.readRegister(getBits(opcode,this.rnPattern).value).add(
            Word.fromUnsignedInteger(getBits(opcode,this.immPattern).value)
        ),
        registers.readRegister(getBits(opcode,this.rtPattern).value)
    )
  }
}


/**
 * Represents a 'STORE' instruction - STR (register offset) - halfword
 */
export class StoreInstructionRegisterOffsetHalfword extends BaseInstruction {
  public name: string = 'STR'
  public pattern: string = '0101000XXXXXXXXX'
  private rnPattern: string = '0101000000XXX000'
  private rmPattern: string = '0101000XXX000000'
  private rtPattern: string = '0101000000000XXX'

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    // todo
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[2]))
    return opcode
  }

  public executeInstruction(
      opcode: Halfword,
      registers: Registers,
      memory: IMemory
  ): void {
    memory.writeWord(
        registers.readRegister(getBits(opcode,this.rnPattern).value).add(
            registers.readRegister(getBits(opcode,this.rmPattern).value)
        ),
        registers.readRegister(getBits(opcode,this.rtPattern).value)
    )
  }
}





/**
 * Represents a 'STORE' instruction - STR (immediate offset) - byte
 */
export class StoreInstructionImmediateOffsetByte extends BaseInstruction {
  public name: string = 'STR'
  public pattern: string = '01100XXXXXXXXXXX'
  private rnPattern: string = '0110000000XXX000'
  private rtPattern: string = '0110000000000XXX'
  private immPattern: string = '01100XXXXX000000'

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    // todo
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.immPattern, createImmediateBits(options[2],5))
    return opcode
  }

  public executeInstruction(
      opcode: Halfword,
      registers: Registers,
      memory: IMemory
  ): void {
    memory.writeWord(
        registers.readRegister(getBits(opcode,this.rnPattern).value).add(
            Word.fromUnsignedInteger(getBits(opcode,this.immPattern).value)
        ),
        registers.readRegister(getBits(opcode,this.rtPattern).value)
    )
  }
}


/**
 * Represents a 'STORE' instruction - STR (register offset) - byte
 */
export class StoreInstructionRegisterOffsetByte extends BaseInstruction {
  public name: string = 'STR'
  public pattern: string = '0101000XXXXXXXXX'
  private rnPattern: string = '0101000000XXX000'
  private rmPattern: string = '0101000XXX000000'
  private rtPattern: string = '0101000000000XXX'

  public canEncodeInstruction(commandName: string, options: string[]): boolean {
    // todo
    return false
  }

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options,3)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[2]))
    return opcode
  }

  public executeInstruction(
      opcode: Halfword,
      registers: Registers,
      memory: IMemory
  ): void {
    memory.writeWord(
        registers.readRegister(getBits(opcode,this.rnPattern).value).add(
            registers.readRegister(getBits(opcode,this.rmPattern).value)
        ),
        registers.readRegister(getBits(opcode,this.rtPattern).value)
    )
  }
}