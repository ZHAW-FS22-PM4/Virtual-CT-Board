import { add } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import {
  checkOptionCount,
  create,
  createLowRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Halfword } from 'types/binary'
import { BaseInstruction } from '../base'

export class CmnInstruction extends BaseInstruction {
  public name: string = 'CMN'
  public pattern: string = '0100001011XXXXXX'
  public rnPattern: string = '0100001011000XXX'
  public rmPattern: string = '0100001011XXX000'
  public expectedOptionCount: number = 2

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, this.expectedOptionCount)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
    return [opcode]
  }

  public executeInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    const rn = getBits(opcode[0], this.rnPattern)
    const rm = getBits(opcode[0], this.rmPattern)
    const result = add(
      registers.readRegister(rn.value),
      registers.readRegister(rm.value)
    )
    registers.setFlags(result.flags)
  }
}
