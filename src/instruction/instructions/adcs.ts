import { Halfword, Word } from 'types/binary'

import { AluResult, add } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Flag, Registers } from 'board/registers'

import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createLowRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'

import { BaseInstruction } from './base'

export class AdcsInstruction extends BaseInstruction {
  public name: string = 'ADCS'
  public pattern: string = '0100000101XXXXXX'
  private rdnPattern: string = '0100000101000XXX'
  private rmPattern: string = '0100000101XXX000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 2, 3)
    if (options.length === 3 && options[0] !== options[1]) {
      throw new Error(
        'First and second parameter must be the same register (Rdn = Rdn + Rm + C).'
      )
    }
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(
      opcode,
      this.rmPattern,
      createLowRegisterBits(options[options.length - 1])
    )
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
    let carry: number = registers.isFlagSet(Flag.C) ? 1 : 0

    let midResult = rmRegisterContent.add(carry)
    let aluResult: AluResult = add(rdnRegisterContent, midResult)

    registers.writeRegister(rdnRegister, aluResult.result)
    registers.setFlags(aluResult.flags)
  }
}
