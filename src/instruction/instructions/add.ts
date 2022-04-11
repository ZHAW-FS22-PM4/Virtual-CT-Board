import { Halfword, Word } from 'types/binary'

import { Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'
import { AluResult, add } from 'board/alu'

import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'

import { BaseInstruction } from './base'

/**
 * Class for ADD instruction adding two register values.
 */
export class AddInstruction extends BaseInstruction {
  public name: string = 'ADD'
  public pattern: string = '01000100XXXXXXXX'
  private rdnPattern: string = '01000100X0000XXX'
  private rmPattern: string = '010001000XXXX000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 2)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdnPattern, createRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createRegisterBits(options[1]))
    return opcode
  }

  public executeInstruction(
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
  }
}
