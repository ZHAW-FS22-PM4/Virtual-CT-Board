import { sub } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'
import { BaseInstruction } from './base'

/**
 * Represents a 'RSBS' instruction which does a reverse substraction.
 */
export class RsbsInstruction extends BaseInstruction {
  public name: string = 'RSBS'
  public pattern: string = '0100001001XXXXXX'
  private rdPattern: string = '0100001001000XXX'
  private rnPattern: string = '0100001001XXX000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 3)
    RsbsInstruction.checkConstImmediate(options)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rnPattern, createLowRegisterBits(options[1]))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    const rd = getBits(opcode, this.rdPattern)
    const rn = getBits(opcode, this.rnPattern)
    const result = sub(
      Word.fromSignedInteger(0),
      registers.readRegister(rn.value)
    )
    registers.setFlags(result.flags)
    registers.writeRegister(rd.value, result.result)
  }

  private static checkConstImmediate(options: string[]): void {
    let immConst = createImmediateBits(options[2], 1)
    if (immConst.value != 0) {
      throw new VirtualBoardError(
        'third option must be #0',
        VirtualBoardErrorType.InvalidParamProvided
      )
    }
  }
}
