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
  LoadInstructionImmediateOffset,
  LoadInstructionImmediateOffsetByte, LoadInstructionImmediateOffsetHalfword, LoadInstructionPointerOffset,
  LoadInstructionRegisterOffset,
  LoadInstructionRegisterOffsetByte, LoadInstructionRegisterOffsetHalfword
} from './instructions/load'
import {StoreInstructionImmediateOffset, StoreInstructionRegisterOffset} from "./instructions/STR";
import {
  StoreInstructionImmediateOffsetByte,
  StoreInstructionImmediateOffsetHalfword,
  StoreInstructionRegisterOffsetByte,
  StoreInstructionRegisterOffsetHalfword
} from "./instructions/STRB";

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
  new LoadInstructionPointerOffset()
])
