import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { IInstruction, ILabelOffsets } from 'instruction/interfaces'
import { Halfword } from 'types/binary'

export abstract class BaseInstruction implements IInstruction {
  public abstract name: string
  public abstract pattern: string

  /**
   * To distinguish which encoder is responsible if multiple commands with same name are possible
   * @param name name of instruction
   * @param options parameter provided for instruction
   * @returns true if the encoder is resposible for given instruction
   */
  public canEncodeInstruction(name: string, options: string[]): boolean {
    return this.name === name
  }

  public abstract encodeInstruction(
    options: string[],
    labels: ILabelOffsets
  ): Halfword

  public abstract executeInstruction(
    opcode: Halfword,
    registers: Registers,
    memory: IMemory
  ): void
}
