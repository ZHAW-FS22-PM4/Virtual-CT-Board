import { Halfword } from 'types/binary'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'
import {
  LoadInstructionImmediateOffset,
  LoadInstructionPointerOffset,
  LoadInstructionRegisterOffset
} from './instructions/ldr'
import {
  LoadInstructionImmediateOffsetByte,
  LoadInstructionRegisterOffsetByte
} from './instructions/ldrb'
import {
  LoadInstructionImmediateOffsetHalfword,
  LoadInstructionRegisterOffsetHalfword
} from './instructions/ldrh'
import { LoadInstructionSignRegisterOffsetByte } from './instructions/ldrsb'
import { LoadInstructionSignedRegisterOffsetHalfword } from './instructions/ldrsh'
import {
  MovInstruction,
  MovsFromLiteralInstruction,
  MovsFromRegisterInstruction
} from './instructions/mov'
import {
  StoreInstructionImmediateOffset,
  StoreInstructionRegisterOffset
} from './instructions/str'
import {
  StoreInstructionImmediateOffsetByte,
  StoreInstructionRegisterOffsetByte
} from './instructions/strb'
import {
  StoreInstructionImmediateOffsetHalfword,
  StoreInstructionRegisterOffsetHalfword
} from './instructions/strh'
import {
  IInstruction,
  IInstructionEncoder,
  IInstructionExecutor,
  IInstructionSet
} from './interfaces'
import { match } from './opcode'

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
  new StoreInstructionImmediateOffset(),
  new StoreInstructionRegisterOffset(),
  new StoreInstructionImmediateOffsetHalfword(),
  new StoreInstructionRegisterOffsetHalfword(),
  new StoreInstructionImmediateOffsetByte(),
  new StoreInstructionRegisterOffsetByte(),
  new LoadInstructionImmediateOffset(),
  new LoadInstructionRegisterOffset(),
  new LoadInstructionImmediateOffsetHalfword(),
  new LoadInstructionRegisterOffsetHalfword(),
  new LoadInstructionImmediateOffsetByte(),
  new LoadInstructionRegisterOffsetByte(),
  new LoadInstructionPointerOffset(),
  new LoadInstructionSignedRegisterOffsetHalfword(),
  new LoadInstructionSignRegisterOffsetByte()
])
