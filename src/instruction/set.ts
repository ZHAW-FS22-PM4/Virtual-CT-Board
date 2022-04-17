import { Halfword } from 'types/binary'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'
import { AdcsInstruction } from './instructions/add/adcs'
import { AddInstruction } from './instructions/add/add'
import {
  AddsImmediate3Instruction,
  AddsImmediate8Instruction,
  AddsRegistersInstruction
} from './instructions/add/adds'
import {
  LdrImmediate5OffsetInstruction,
  LdrRegisterInstruction,
  LdrRegisterOffsetInstruction
} from './instructions/load/ldr'
import {
  LdrbImmediate5OffsetInstruction,
  LdrbRegisterOffsetInstruction
} from './instructions/load/ldrb'
import {
  LdrhImmediate5OffsetInstruction,
  LdrhRegisterOffsetInstruction
} from './instructions/load/ldrh'
import { LdrsbRegisterOffsetInstruction } from './instructions/load/ldrsb'
import { LdrshRegisterOffsetInstruction } from './instructions/load/ldrsh'
import { MovInstruction } from './instructions/mov/mov'
import {
  MovsImmediate8Instruction,
  MovsRegistersInstruction
} from './instructions/mov/movs'
import { MulsInstruction } from './instructions/multiply/muls'
import { RsbsInstruction } from './instructions/subtract/rsbs'
import { SbcsInstruction } from './instructions/subtract/sbcs'
import {
  StrImmediate5OffsetInstruction,
  StrRegisterOffsetInstruction
} from './instructions/store/str'
import {
  StrbImmediate5OffsetInstruction,
  StrbRegisterOffsetInstruction
} from './instructions/store/strb'
import {
  StrhImmediate5OffsetInstruction,
  StrhRegisterOffsetInstruction
} from './instructions/store/strh'
import {
  SubsImmediate3Instruction,
  SubsImmediate8Instruction,
  SubsRegistersInstruction
} from './instructions/subtract/subs'
import {
  IInstruction,
  IInstructionEncoder,
  IInstructionExecutor,
  IInstructionSet
} from './interfaces'
import { match } from './opcode'
import {MvnsInstruction} from "./instructions/logical/mvns";
import {AndsInstruction} from "./instructions/logical/ands";
import {BicsInstruction} from "./instructions/logical/bics";
import {OrrsInstruction} from "./instructions/logical/orrs";

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
  new AndsInstruction(),
  new BicsInstruction(),
  new LdrImmediate5OffsetInstruction(),
  new LdrRegisterOffsetInstruction(),
  new LdrhImmediate5OffsetInstruction(),
  new LdrhRegisterOffsetInstruction(),
  new LdrbImmediate5OffsetInstruction(),
  new LdrbRegisterOffsetInstruction(),
  new LdrRegisterInstruction(),
  new LdrshRegisterOffsetInstruction(),
  new LdrsbRegisterOffsetInstruction(),
  new MovInstruction(),
  new MovsRegistersInstruction(),
  new MovsImmediate8Instruction(),
  new MulsInstruction(),
  new MvnsInstruction(),
  new OrrsInstruction(),
  new RsbsInstruction(),
  new SbcsInstruction(),
  new StrImmediate5OffsetInstruction(),
  new StrRegisterOffsetInstruction(),
  new StrhImmediate5OffsetInstruction(),
  new StrhRegisterOffsetInstruction(),
  new StrbImmediate5OffsetInstruction(),
  new StrbRegisterOffsetInstruction(),
  new SubsRegistersInstruction(),
  new SubsImmediate3Instruction(),
  new SubsImmediate8Instruction()
])
