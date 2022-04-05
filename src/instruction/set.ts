import { Halfword } from 'types/binary'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'

import {
  IInstruction,
  IInstructionEncoder,
  IInstructionExecutor,
  IInstructionSet
} from './interfaces'
import { match } from './opcode'

import {
  MovInstruction,
  MovsFromRegisterInstruction,
  MovsFromLiteralInstruction
} from './instructions/mov'
import {
  SubsRegisterInstruction,
  SubsSmallImmediateInstruction,
  SubsLargeImmediateInstruction
} from './instructions/subs'
import { RsbsInstruction } from './instructions/rsbs'
import { SbcsInstruction } from './instructions/sbcs'

export class InstructionSet implements IInstructionSet {
  private readonly instructions: IInstruction[]

  constructor(instructions: IInstruction[]) {
    this.instructions = instructions
  }

  public getEncoder(name: string, options: string[]): IInstructionEncoder {
    for (const instruction of this.instructions) {
      if (instruction.canEncodeInstruction(name, options)) {
        return instruction
      }
    }
    throw new VirtualBoardError(
      `Unable to find instruction encoder for the instruction '${name}'.`,
      VirtualBoardErrorType.NoEncoderFound
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

export default new InstructionSet([
  new MovInstruction(),
  new MovsFromRegisterInstruction(),
  new MovsFromLiteralInstruction(),
  new SubsRegisterInstruction(),
  new SubsSmallImmediateInstruction(),
  new SubsLargeImmediateInstruction(),
  new RsbsInstruction(),
  new SbcsInstruction()
])
