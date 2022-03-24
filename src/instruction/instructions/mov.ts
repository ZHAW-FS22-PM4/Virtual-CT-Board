import { Halfword } from 'types/binary'
import {
  numericalRepresentationFromString,
  Register,
  Registers
} from 'board/registers'
import { IMemory } from 'board/memory/interfaces'

import { ILabelOffsets, IInstruction } from '../interfaces'

/**
 * Represents a 'MOV' instruction.
 */
export class MovInstruction implements IInstruction {
  public name: string = 'MOV'
  public pattern: string = '01000110XXXXXXXX'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    let instruction = this.pattern.substring(0, 8)
    let rd = numericalRepresentationFromString(options[0]).toString(2)
    let rm = numericalRepresentationFromString(options[1]).toString(2)
    let opcode = Halfword.fromSignedInteger(
      parseInt(instruction.concat(rd[0], rm, rd[1], rd[2], rd[4]), 2)
    )
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    let param = opcode.toBinaryString().slice(8)
    let rd = parseInt(param[0].concat(param[5], param[6], param[7]), 2)
    let rm = parseInt(param[1].concat(param[2], param[3], param[4]), 2)
    registers.writeRegister(rd, registers.readRegister(rm))
  }
}

/**
 * Represents a 'MOVS' instruction, getting a value from a registers.
 */
export class MovsFromRegisterInstruction implements IInstruction {
  public name: string = 'MOVS'
  public pattern: string = '0000000000XXXXXX'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    throw new Error('Instruction not yet implemented.')
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    throw new Error('Instruction not yet implemented.')
  }
}

/**
 * Represents a 'MOVS' instruction, getting a value from a literal.
 */
export class MovsFromLiteralInstruction implements IInstruction {
  public name: string = 'MOVS'
  public pattern: string = '00100XXXXXXXXXXX'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    throw new Error('Instruction not yet implemented.')
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    throw new Error('Instruction not yet implemented.')
  }
}
