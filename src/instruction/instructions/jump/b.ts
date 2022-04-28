import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import { checkOptionCount, create, getBits, setBits } from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'
import { BinaryType } from 'types/binary/binaryType'

/**
 * Represents a 'B' instruction.
 */
export class BInstruction extends BaseInstruction {
  public name: string = 'B'
  public pattern: string = '11100XXXXXXXXXXX'

  public needsLabels: boolean = true

  public encodeInstruction(
    options: string[],
    labels?: ILabelOffsets
  ): Halfword[] {
    checkOptionCount(options, 1)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(
      opcode,
      this.pattern,
      labels
        ? Word.fromUnsignedInteger(labels[options[0]].value).toHalfwords()[0]
        : Halfword.fromUnsignedInteger(0x00)
    )
    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    const imm11 = new BinaryType(
      getBits(opcode[0], this.pattern).toUnsignedInteger(),
      11
    )
    registers.writeRegister(
      Register.PC,
      registers.readRegister(Register.PC).add(imm11.toSignedInteger())
    )
  }
}
