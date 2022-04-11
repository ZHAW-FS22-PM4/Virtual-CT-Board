import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import {
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  setBits
} from 'instruction/opcode'
import { Halfword } from 'types/binary'
import { BaseInstruction } from '../baseInstruction'

export class AsrsRegisterInstruction extends BaseInstruction {
  public name: string = 'ASRS'
  public pattern: string = '0100000100XXXXXX'
  private rdnPattern: string = '0100000100000XXX'
  private rmPattern: string = '0100000100XXX000'
  private expectedOptionCount: number = 3

  public encodeInstruction (
    options: string[],
    labels: ILabelOffsets
  ): Halfword {
    checkOptionCount(options, this.expectedOptionCount)
    if (options[0] !== options[1])
      throw new Error('Parameter 1 and 2 must be identical!')
    let opcode: Halfword = create(this.pattern)
    opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[2]))
    return opcode
  }

  public executeInstruction (
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    throw new Error('Method not implemented.')
  }
  public canEncodeInstruction (
    commandName: string,
    options: string[]
  ): boolean {
    throw new Error('Method not implemented.')
  }
}

export class AsrsImmediateInstruction extends BaseInstruction {
  public name: string = 'ASRS'
  public pattern: string = '00010XXXXXXXXXXX'
  private rdPattern: string = '0001000000000XXX'
  private rmPattern: string = '0001000000XXX000'
  private immPattern: string = '00010XXXXX000000'
  private expectedOptionCount: number = 3

  public encodeInstruction (
    options: string[],
    labels: ILabelOffsets
  ): Halfword {
    checkOptionCount(options, this.expectedOptionCount)
    let opcode: Halfword = create(this.pattern)
    let immBits = createImmediateBits(options[2], 5)
    opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
    opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
    opcode = setBits(opcode, this.immPattern, immBits)
    return opcode
  }

  public executeInstruction (
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void {
    throw new Error('Method not implemented.')
  }
  public canEncodeInstruction (
    commandName: string,
    options: string[]
  ): boolean {
    throw new Error('Method not implemented.')
  }
}
