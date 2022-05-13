import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import {
  checkBracketsOnLastOptions,
  checkOptionCount,
  create,
  createLowRegisterBits,
  getBits,
  removeBracketsFromRegisterString,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'

/**
 * Represents a 'LOAD' instruction - LDRSB (register offset) - byte
 */
export class LdrsbRegisterOffsetInstruction extends BaseInstruction {
  public name: string = 'LDRSB'
  public pattern: string = '0101011XXXXXXXXX'
  private rnPattern: string = '0101011000XXX000'
  private rmPattern: string = '0101011XXX000000'
  private rtPattern: string = '0101011000000XXX'
  private expectedOptionCount: number = 3

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, this.expectedOptionCount)
    checkBracketsOnLastOptions(options, this.expectedOptionCount)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rtPattern, createLowRegisterBits(options[0]))
    opcode = setBits(
      opcode,
      this.rnPattern,
      createLowRegisterBits(removeBracketsFromRegisterString(options[1]))
    )
    opcode = setBits(
      opcode,
      this.rmPattern,
      createLowRegisterBits(removeBracketsFromRegisterString(options[2]))
    )
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    registers.writeRegister(
      getBits(opcode[0], this.rtPattern).value,
      Word.fromSignedInteger(
        memory
          .readByte(
            registers
              .readRegister(getBits(opcode[0], this.rnPattern).value)
              .add(
                registers.readRegister(getBits(opcode[0], this.rmPattern).value)
              )
          )
          .toSignedInteger()
      )
    )
  }
}
