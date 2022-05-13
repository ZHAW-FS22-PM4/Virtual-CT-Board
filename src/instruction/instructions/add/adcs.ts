import { add, AluResult } from 'board/alu'
import { IMemory } from 'board/memory/interfaces'
import { Flag, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import {
  checkOptionCount,
  create,
  createLowRegisterBits,
  getBits,
  setBits
} from 'instruction/opcode'
import { Halfword, Word } from 'types/binary'
import { BaseInstruction } from '../base'

export class AdcsInstruction extends BaseInstruction {
  public name: string = 'ADCS'
  public pattern: string = '0100000101XXXXXX'
  private rdnPattern: string = '0100000101000XXX'
  private rmPattern: string = '0100000101XXX000'

  public encodeInstruction(options: string[]): Halfword[] {
    checkOptionCount(options, 2, 3)
    if (options.length === 3 && options[0] !== options[1]) {
      throw new InstructionError(
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
    let carry: Word = Word.fromUnsignedInteger(
      registers.isFlagSet(Flag.C) ? 1 : 0
    )

    let midResult: AluResult = add(rmRegisterContent, carry)
    let finalResult: AluResult = add(midResult.result, rdnRegisterContent)

    registers.writeRegister(rdnRegister, finalResult.result)
    registers.setFlags({
      [Flag.N]: finalResult.flags.N,
      [Flag.Z]: finalResult.flags.Z,
      [Flag.C]: midResult.flags.C || finalResult.flags.C,
      [Flag.V]:
        (midResult.flags.V && !finalResult.flags.V) ||
        (!midResult.flags.V && finalResult.flags.V)
    })
  }
}
