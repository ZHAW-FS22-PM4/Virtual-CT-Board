import { IMemory } from 'board/memory/interfaces'
import { Flag, Register, Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import { checkOptionCount, create, getBits, setBits } from 'instruction/opcode'
import { Byte, Halfword } from 'types/binary'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'
import { BaseInstruction } from '../base'

abstract class ConditionalJumpInstruction extends BaseInstruction {
  public pattern: string = '1101XXXXXXXXXXXX'
  protected abstract conditionNumber: number
  private conditionPattern: string = '1101XXXX00000000'
  private offsetPattern: string = '11010000XXXXXXXX'

  public encodeInstruction(
    options: string[],
    labels?: ILabelOffsets
  ): Halfword[] {
    checkOptionCount(options, 1)

    let opcode = create(this.pattern)

    opcode = setBits(
      opcode,
      this.conditionPattern,
      Halfword.fromUnsignedInteger(this.conditionNumber)
    )

    let offset
    if (labels) {
      let word = labels[options[0]].toSignedInteger()
      if (word % 2 !== 0) {
        throw new VirtualBoardError(
          `Offset ${word} not dividable by two.`,
          VirtualBoardErrorType.InvalidParamProvided
        )
      }
      if (
        word < Byte.MIN_SIGNED_VALUE * 2 ||
        word > Byte.MAX_SIGNED_VALUE * 2
      ) {
        throw new VirtualBoardError(
          `Offset ${word} out of range.`,
          VirtualBoardErrorType.InvalidParamProvided
        )
      }
      // offset is divided by two here since on the real CT board the
      // offset corresponds to the amount of halfwords but on the virtual
      // CT board the value corresponds to the amount of bytes
      // so the value is divided by two to achieve the same effect
      offset = Halfword.fromSignedInteger(word / 2)
    } else {
      offset = Halfword.fromUnsignedInteger(0)
    }

    opcode = setBits(opcode, this.offsetPattern, offset)

    return [opcode]
  }

  protected onExecuteInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void {
    if (this.checkFlags(registers)) {
      let imm8 = getBits(opcode[0], this.offsetPattern).toBytes()[0]
      registers.writeRegister(
        Register.PC,
        registers.readRegister(Register.PC).add(imm8.toSignedInteger() * 2)
      )
    }
  }

  protected abstract checkFlags(registers: Registers): boolean
}

export class BEQConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BEQ'
  protected conditionNumber: number = 0
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.Z)
  }
}

export class BNEConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BNE'
  protected conditionNumber: number = 1
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.Z)
  }
}

export class BCSConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BCS'
  protected conditionNumber: number = 2
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.C)
  }
}

export class BHSConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BHS'
  protected conditionNumber: number = 2
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.C)
  }
}

export class BCCConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BCC'
  protected conditionNumber: number = 3
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.C)
  }
}

export class BLOConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BLO'
  protected conditionNumber: number = 3
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.C)
  }
}

export class BMIConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BMI'
  protected conditionNumber: number = 4
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.N)
  }
}

export class BPLConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BPL'
  protected conditionNumber: number = 5
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.N)
  }
}

export class BVSConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BVS'
  protected conditionNumber: number = 6
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.V)
  }
}

export class BVCConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BVC'
  protected conditionNumber: number = 7
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.V)
  }
}

export class BHIConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BHI'
  protected conditionNumber: number = 8
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.C) && !registers.isFlagSet(Flag.Z)
  }
}

export class BLSConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BLS'
  protected conditionNumber: number = 9
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.C) || registers.isFlagSet(Flag.Z)
  }
}

export class BGEConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BGE'
  protected conditionNumber: number = 10
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.N) === registers.isFlagSet(Flag.V)
  }
}

export class BLTConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BLT'
  protected conditionNumber: number = 11
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.N) !== registers.isFlagSet(Flag.V)
  }
}

export class BGTConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BGT'
  protected conditionNumber: number = 12
  protected checkFlags(registers: Registers): boolean {
    return (
      !registers.isFlagSet(Flag.Z) &&
      registers.isFlagSet(Flag.N) === registers.isFlagSet(Flag.V)
    )
  }
}

export class BLEConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BLE'
  protected conditionNumber: number = 13
  protected checkFlags(registers: Registers): boolean {
    return (
      registers.isFlagSet(Flag.Z) ||
      registers.isFlagSet(Flag.N) !== registers.isFlagSet(Flag.V)
    )
  }
}

export class BALConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BAL'
  protected conditionNumber: number = 14
  protected checkFlags(registers: Registers): boolean {
    return true
  }
}
