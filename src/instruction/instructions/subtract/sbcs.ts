import { sub } from 'board/alu'
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
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'

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
    const borrow = Word.fromUnsignedInteger(registers.isFlagSet(Flag.C) ? 0 : 1)
    const midResult = sub(
      registers.readRegister(rdn.value),
      registers.readRegister(rm.value)
    )
    const finalResult = sub(midResult.result, borrow)
    registers.writeRegister(rdn.value, finalResult.result)
    registers.setFlags({
      [Flag.N]: finalResult.flags.N,
      [Flag.Z]: finalResult.flags.Z,
      [Flag.C]: midResult.flags.C && finalResult.flags.C,
      [Flag.V]:
        (midResult.flags.V && !finalResult.flags.V) ||
        (!midResult.flags.V && finalResult.flags.V)
    })
  }
}
