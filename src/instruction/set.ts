import { Halfword } from 'types/binary'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'

import {
  IInstruction,
  IInstructionEncoder,
  IInstructionExecutor,
  IInstructionSet
} from './interfaces'
import { match } from './opcode'

import { AdcsInstruction } from './instructions/adcs'
import { AddInstruction } from './instructions/add'
import {
  AddsImmediate3Instruction,
  AddsImmediate8Instruction,
  AddsRegistersInstruction
} from './instructions/adds'
import { MovInstruction } from './instructions/mov'
import {
  MovsImmediate8Instruction,
  MovsRegistersInstruction
} from './instructions/movs'
import { MulsInstruction } from './instructions/muls'
import { RsbsInstruction } from './instructions/rsbs'
import { SbcsInstruction } from './instructions/sbcs'
import {
  SubsImmediate3Instruction,
  SubsImmediate8Instruction,
  SubsRegistersInstruction
} from './instructions/subs'

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
  new AdcsInstruction(),
  new AddInstruction(),
  new AddsRegistersInstruction(),
  new AddsImmediate3Instruction(),
  new AddsImmediate8Instruction(),
  new MovInstruction(),
  new MovsRegistersInstruction(),
  new MovsImmediate8Instruction(),
  new MulsInstruction(),
  new RsbsInstruction(),
  new SbcsInstruction(),
  new SubsRegistersInstruction(),
  new SubsImmediate3Instruction(),
  new SubsImmediate8Instruction()
])
