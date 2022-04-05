import { Halfword, Word } from 'types/binary'
import {
  checkOptionCount,
  create,
  createLowRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Flag, Registers } from 'board/registers'
import { IMemory } from 'board/memory/interfaces'
import { add } from 'board/alu'

import { ILabelOffsets } from '../interfaces'
import { BaseInstruction } from './baseInstruction'

/**
 * Represents a 'SBCS' instruction which does a substraction with carry.
 */
export class SbcsInstruction extends BaseInstruction {
  public name: string = 'SBCS'
  public pattern: string = '0100000110XXXXXX'
  private rdnPattern: string = '0100000110000XXX'
  private rmPattern: string = '0100000110XXX000'

  public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
    checkOptionCount(options, 2)
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
    return opcode
  }

  public executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    const rdn = getBits(opcode, this.rdnPattern)
    const rm = getBits(opcode, this.rmPattern)
    const carry = registers.isFlagSet(Flag.C) ? 1 : 0
    const notRm = Word.fromUnsignedInteger(
      ~registers.readRegister(rm.value).value >>> 0
    )
    const result = add(registers.readRegister(rdn.value), notRm.add(carry))
    registers.setFlags(result.flags)
    registers.writeRegister(rdn.value, result.result)
  }
}
