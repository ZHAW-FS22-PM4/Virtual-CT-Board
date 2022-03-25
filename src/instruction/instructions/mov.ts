import { Halfword, Word } from 'types/binary'
import { create, getBits, setBits } from 'instruction/opcode'
import { Register, Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'
import { $enum } from 'ts-enum-util'

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
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(
      opcode,
      this.rdPattern,
      Halfword.fromUnsignedInteger($enum(Register).getValueOrThrow(options[0]))
    )
    opcode = setBits(
      opcode,
      this.rmPattern,
      Halfword.fromUnsignedInteger($enum(Register).getValueOrThrow(options[1]))
    )
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
  public name: string = 'MOVS'
  public pattern: string = '0000000000XXXXXX'
  private rdPattern: string = '0000000000000XXX'
  private rmPattern: string = '0000000000XXX000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(
      opcode,
      this.rdPattern,
      Halfword.fromUnsignedInteger($enum(Register).getValueOrThrow(options[0]))
    )
    opcode = setBits(
      opcode,
      this.rmPattern,
      Halfword.fromUnsignedInteger($enum(Register).getValueOrThrow(options[1]))
    )
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
 * Represents a 'MOVS' instruction, getting a value from a literal.
 */
export class MovsFromLiteralInstruction implements IInstruction {
  public name: string = 'MOVS'
  public pattern: string = '00100XXXXXXXXXXX'
  private rdPattern: string = '00100XXX00000000'
  private immPattern: string = '00100000XXXXXXXX'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(
      opcode,
      this.rdPattern,
      Halfword.fromUnsignedInteger($enum(Register).getValueOrThrow(options[0]))
    )
    opcode = setBits(
      opcode,
      this.immPattern,
      Halfword.fromUnsignedInteger($enum(Register).getValueOrThrow(options[1]))
    )
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister(
      getBits(opcode, this.rdPattern).value,
      Word.fromHalfwords(getBits(opcode, this.immPattern))
    )
  }
}
