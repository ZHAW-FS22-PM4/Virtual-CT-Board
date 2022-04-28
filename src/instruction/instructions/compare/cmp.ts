import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { isImmediate, isLowRegister } from 'instruction/opcode'
import { Halfword } from 'types/binary'
import { BaseInstruction } from '../base'

export class CmpInstructionWithLowRegisters extends BaseInstruction {
  public name: string = 'CMP'
  public pattern: string = '0100001010XXXXXX'

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      options.every((x) => !isImmediate(x) && isLowRegister(x))
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    throw new Error('Method not implemented.')
  }

  public executeInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    throw new Error('Method not implemented.')
  }
}

export class CmpInstructionWithHighRegisters extends BaseInstruction {
  public name: string = 'CMP'
  public pattern: string = '01000101XXXXXXXX'

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      options.find((x) => !isImmediate(x) && !isLowRegister(x)) !== undefined
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    throw new Error('Method not implemented.')
  }

  public executeInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    throw new Error('Method not implemented.')
  }
}

export class CmpInstructionWithImmediateOffset extends BaseInstruction {
  public name: string = 'CMP'
  public pattern: string = '00101XXXXXXXXXXX'

  public canEncodeInstruction(name: string, options: string[]): boolean {
    return (
      super.canEncodeInstruction(name, options) &&
      isLowRegister(options[0]) &&
      isImmediate(options[1])
    )
  }

  public encodeInstruction(options: string[]): Halfword[] {
    throw new Error('Method not implemented.')
  }

  public executeInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    throw new Error('Method not implemented.')
  }
}
