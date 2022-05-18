import { IMemory } from 'board/memory/interfaces'
import { Register, Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  getBits,
  mapLabelOffset,
  setBits
} from 'instruction/opcode'
import { getBinaryValue } from 'instruction/utils'
import { Halfword, Word } from 'types/binary'
import { BinaryType } from 'types/binary/binaryType'
import { BaseInstruction } from '../base'

/**
 * Represents a 'BL' instruction.
 */
export class BlInstruction extends BaseInstruction {
  public name: string = 'BL'
  public pattern: string = '11110XXXXXXXXXXX'

  public needsLabels: boolean = true
  public opcodeLength: number = 2

  private imm10Pattern: string = '000000XXXXXXXXXX'
  private imm11Pattern: string = '00000XXXXXXXXXXX'
  public patternSecondPart: string = '11X1XXXXXXXXXXXX'

  public encodeInstruction(
    options: string[],
    labels?: ILabelOffsets
  ): Halfword[] {
    checkOptionCount(options, 1)
    const offset = mapLabelOffset(options[0], labels)
    const offsetBinaryString = offset.toBinaryString()
    const sBit = offset.isBitSet(24)
    const i1Bit = offset.isBitSet(23)
    const i2Bit = offset.isBitSet(22)

    let opcodeFirstPart: Halfword = create(this.pattern)
    if (sBit) {
      opcodeFirstPart = opcodeFirstPart.setBit(10)
    }

    opcodeFirstPart = setBits(
      opcodeFirstPart,
      this.imm10Pattern,
      Halfword.fromUnsignedInteger(
        parseInt(offsetBinaryString.substring(10, 20), 2)
      )
    )

    let opcodeSecondPart: Halfword = create(this.patternSecondPart)
    if (i1Bit == sBit) {
      opcodeSecondPart = opcodeSecondPart.setBit(13)
    }

    if (i2Bit == sBit) {
      opcodeSecondPart = opcodeSecondPart.setBit(11)
    }

    opcodeSecondPart = setBits(
      opcodeSecondPart,
      this.imm11Pattern,
      Halfword.fromUnsignedInteger(
        parseInt(offsetBinaryString.substring(20, 31), 2)
      )
    )

    return [opcodeFirstPart, opcodeSecondPart]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    const sBit = opcode[0].isBitSet(10)
    const j1Bit = opcode[1].isBitSet(13)
    const j2Bit = opcode[1].isBitSet(11)

    const imm10 = new BinaryType(
      getBits(opcode[0], this.imm10Pattern).toUnsignedInteger(),
      10
    ).toBinaryString()

    const imm11 = new BinaryType(
      getBits(opcode[1], this.imm11Pattern).toUnsignedInteger(),
      11
    ).toBinaryString()

    const i1Bit = !(j1Bit !== sBit)
    const i2Bit = !(j2Bit !== sBit)

    let imm =
      getBinaryValue(sBit).repeat(8) +
      getBinaryValue(i1Bit) +
      getBinaryValue(i2Bit) +
      imm10 +
      imm11 +
      '0'

    registers.writeRegister(Register.LR, registers.readRegister(Register.PC))

    registers.writeRegister(
      Register.PC,
      registers
        .readRegister(Register.PC)
        .add(Word.fromUnsignedInteger(parseInt(imm, 2)))
    )
  }
}
