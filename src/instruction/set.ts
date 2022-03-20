import { Halfword } from 'types/binary'
import {
  IInstruction,
  IInstructionEncoder,
  IInstructionExecutor,
  IInstructionSet
} from './interfaces'
import { match } from './opcode'
import { NoEncoderFoundError } from '../types/error'

import { MovInstruction } from './instructions/mov'

class InstructionSet implements IInstructionSet {
  private readonly instructions: IInstruction[]

  constructor(instructions: IInstruction[]) {
    this.instructions = instructions
  }

  public getEncoder(name: string): IInstructionEncoder {
    for (const instruction of this.instructions) {
      if (instruction.name === name) {
        return instruction
      }
    }
    throw new NoEncoderFoundError(
      `Unable to find instruction encoder for the instruction '${name}'.`
    )
  }

  public getExecutor(opcode: Halfword): IInstructionExecutor {
    for (const instruction of this.instructions) {
      if (match(opcode, instruction.pattern)) {
        return instruction
      }
    }
    throw new Error(
      `Unable to find instruction executor for the opcode '${opcode.toHexString()}'.`
    )
  }
}

export default new InstructionSet([new MovInstruction()])
