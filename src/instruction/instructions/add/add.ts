import { add, AluResult } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import {
  checkOptionCount,
  create,
  createRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'

/**
 * Class for ADD instruction adding two register values.
 */
export class AddInstruction extends BaseInstruction {
  public name: string = 'ADD'
  public pattern: string = '01000100XXXXXXXX'
  private rdnPattern: string = '01000100X0000XXX'
  private rmPattern: string = '010001000XXXX000'

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 2)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdnPattern, createRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createRegisterBits(options[1]))
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    let rdnRegister: number = getBits(opcode[0], this.rdnPattern).value
    let rmRegister: number = getBits(opcode[0], this.rmPattern).value

    let rdnRegisterContent: Word = registers.readRegister(rdnRegister)
    let rmRegisterContent: Word = registers.readRegister(rmRegister)

    let aluResult: AluResult = add(rdnRegisterContent, rmRegisterContent)

    registers.writeRegister(rdnRegister, aluResult.result)
  }
}
