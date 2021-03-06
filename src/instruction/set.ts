import { InstructionError } from 'instruction/error'
import {
  BALConditionalJumpInstruction,
  BCCConditionalJumpInstruction,
  BCSConditionalJumpInstruction,
  BEQConditionalJumpInstruction,
  BGEConditionalJumpInstruction,
  BGTConditionalJumpInstruction,
  BHIConditionalJumpInstruction,
  BHSConditionalJumpInstruction,
  BLEConditionalJumpInstruction,
  BLOConditionalJumpInstruction,
  BLSConditionalJumpInstruction,
  BLTConditionalJumpInstruction,
  BMIConditionalJumpInstruction,
  BNEConditionalJumpInstruction,
  BPLConditionalJumpInstruction,
  BVCConditionalJumpInstruction,
  BVSConditionalJumpInstruction
} from 'instruction/instructions/jump/bconditional'
import { BlInstruction } from 'instruction/instructions/jump/bl'
import { BlxInstruction } from 'instruction/instructions/jump/blx'
import { BxInstruction } from 'instruction/instructions/jump/bx'
import { PushInstruction } from 'instruction/instructions/stack/push'
import { Halfword } from 'types/binary'
import { AdcsInstruction } from './instructions/add/adcs'
import { AddInstruction } from './instructions/add/add'
import {
  AddsImmediate3Instruction,
  AddsImmediate8Instruction,
  AddsRegistersInstruction
} from './instructions/add/adds'
import { CmnInstruction } from './instructions/compare/cmn'
import {
  CmpInstructionWithHighRegisters,
  CmpInstructionWithImmediateOffset,
  CmpInstructionWithLowRegisters
} from './instructions/compare/cmp'
import { MrsInstruction } from './instructions/flags/mrs'
import { MsrInstruction } from './instructions/flags/msr'
import { BInstruction } from './instructions/jump/b'
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
import { AndsInstruction } from './instructions/logical/ands'
import { BicsInstruction } from './instructions/logical/bics'
import { EorsInstruction } from './instructions/logical/eors'
import { MvnsInstruction } from './instructions/logical/mvns'
import { OrrsInstruction } from './instructions/logical/orrs'
import { TstInstruction } from './instructions/logical/tst'
import { MovInstruction } from './instructions/mov/mov'
import {
  MovsImmediate8Instruction,
  MovsRegistersInstruction
} from './instructions/mov/movs'
import { MulsInstruction } from './instructions/multiply/muls'
import {
  AsrsImmediateInstruction,
  AsrsRegisterInstruction
} from './instructions/shift_rotate/asrs'
import {
  LslsImmediateInstruction,
  LslsRegisterInstruction
} from './instructions/shift_rotate/lsls'
import {
  LsrsImmediateInstruction,
  LsrsRegisterInstruction
} from './instructions/shift_rotate/lsrs'
import { RorsInstruction } from './instructions/shift_rotate/rors'
import { PopInstruction } from './instructions/stack/pop'
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
import { RsbsInstruction } from './instructions/subtract/rsbs'
import { SbcsInstruction } from './instructions/subtract/sbcs'
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
    throw new InstructionError(`Unable to find instruction '${name}'.`)
  }

  public getExecutor(opcode: Halfword[]): IInstructionExecutor {
    for (const instruction of this.instructions) {
      if (match(opcode[0], instruction.pattern)) {
        if (opcode.length === 1) return instruction
        if (match(opcode[1], instruction.patternSecondPart)) {
          return instruction
        }
      }
    }
    throw new Error(
      `Unable to find instruction executor for the opcode '${opcode[0].toHexString()}'.`
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
  new AsrsRegisterInstruction(),
  new AsrsImmediateInstruction(),
  new BicsInstruction(),
  new BInstruction(),
  new CmpInstructionWithLowRegisters(),
  new CmpInstructionWithHighRegisters(),
  new CmpInstructionWithImmediateOffset(),
  new CmnInstruction(),
  new BlInstruction(),
  new BlxInstruction(),
  new BxInstruction(),
  new EorsInstruction(),
  new LdrImmediate5OffsetInstruction(),
  new LdrRegisterOffsetInstruction(),
  new LdrhImmediate5OffsetInstruction(),
  new LdrhRegisterOffsetInstruction(),
  new LdrbImmediate5OffsetInstruction(),
  new LdrbRegisterOffsetInstruction(),
  new LdrRegisterInstruction(),
  new LdrshRegisterOffsetInstruction(),
  new LdrsbRegisterOffsetInstruction(),
  new LslsImmediateInstruction(),
  new LslsRegisterInstruction(),
  new LsrsImmediateInstruction(),
  new LsrsRegisterInstruction(),
  new MovInstruction(),
  new MovsRegistersInstruction(),
  new MovsImmediate8Instruction(),
  new MrsInstruction(),
  new MsrInstruction(),
  new MulsInstruction(),
  new MvnsInstruction(),
  new OrrsInstruction(),
  new RorsInstruction(),
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
  new SubsImmediate8Instruction(),
  new TstInstruction(),
  new BEQConditionalJumpInstruction(),
  new BNEConditionalJumpInstruction(),
  new BCSConditionalJumpInstruction(),
  new BHSConditionalJumpInstruction(),
  new BCCConditionalJumpInstruction(),
  new BLOConditionalJumpInstruction(),
  new BMIConditionalJumpInstruction(),
  new BPLConditionalJumpInstruction(),
  new BVSConditionalJumpInstruction(),
  new BVCConditionalJumpInstruction(),
  new BHIConditionalJumpInstruction(),
  new BLSConditionalJumpInstruction(),
  new BGEConditionalJumpInstruction(),
  new BLTConditionalJumpInstruction(),
  new BGTConditionalJumpInstruction(),
  new BLEConditionalJumpInstruction(),
  new BALConditionalJumpInstruction(),
  new PushInstruction(),
  new PopInstruction()
])
