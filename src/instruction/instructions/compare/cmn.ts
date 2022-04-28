import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { Halfword } from 'types/binary'
import { BaseInstruction } from '../base'

export class CmnInstruction extends BaseInstruction {
  public name: string = 'CMN'
  public pattern: string = '0100001011XXXXXX'
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
