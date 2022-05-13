import { IMemory } from 'board/memory/interfaces'
import { Flag, Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import { ILabelOffsets } from 'instruction/interfaces'
import { checkOptionCount, create, getBits, setBits } from 'instruction/opcode'
import { Byte, Halfword } from 'types/binary'
import { BaseInstruction } from '../base'

abstract class ConditionalJumpInstruction extends BaseInstruction {
  public pattern: string = '1101XXXXXXXXXXXX'
  protected abstract conditionNumber: number
  private conditionPattern: string = '1101XXXX00000000'
  private offsetPattern: string = '11010000XXXXXXXX'
  public needsLabels: boolean = true

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
        throw new Error(`Offset ${word} not dividable by two.`)
      }
      if (
        word < Byte.MIN_SIGNED_VALUE * 2 ||
        word > Byte.MAX_SIGNED_VALUE * 2
      ) {
        throw new InstructionError(`Offset ${word} out of range.`)
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
  public pattern: string = '11010000XXXXXXXX'
  protected conditionNumber: number = 0
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.Z)
  }
}

export class BNEConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BNE'
  public pattern: string = '11010001XXXXXXXX'
  protected conditionNumber: number = 1
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.Z)
  }
}

export class BCSConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BCS'
  public pattern: string = '11010010XXXXXXXX'
  protected conditionNumber: number = 2
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.C)
  }
}

export class BHSConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BHS'
  public pattern: string = '11010010XXXXXXXX'
  protected conditionNumber: number = 2
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.C)
  }
}

export class BCCConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BCC'
  public pattern: string = '11010011XXXXXXXX'
  protected conditionNumber: number = 3
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.C)
  }
}

export class BLOConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BLO'
  public pattern: string = '11010011XXXXXXXX'
  protected conditionNumber: number = 3
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.C)
  }
}

export class BMIConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BMI'
  public pattern: string = '11010100XXXXXXXX'
  protected conditionNumber: number = 4
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.N)
  }
}

export class BPLConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BPL'
  public pattern: string = '11010101XXXXXXXX'
  protected conditionNumber: number = 5
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.N)
  }
}

export class BVSConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BVS'
  public pattern: string = '11010110XXXXXXXX'
  protected conditionNumber: number = 6
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.V)
  }
}

export class BVCConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BVC'
  public pattern: string = '11010111XXXXXXXX'
  protected conditionNumber: number = 7
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.V)
  }
}

export class BHIConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BHI'
  public pattern: string = '11011000XXXXXXXX'
  protected conditionNumber: number = 8
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.C) && !registers.isFlagSet(Flag.Z)
  }
}

export class BLSConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BLS'
  public pattern: string = '11011001XXXXXXXX'
  protected conditionNumber: number = 9
  protected checkFlags(registers: Registers): boolean {
    return !registers.isFlagSet(Flag.C) || registers.isFlagSet(Flag.Z)
  }
}

export class BGEConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BGE'
  public pattern: string = '11011010XXXXXXXX'
  protected conditionNumber: number = 10
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.N) === registers.isFlagSet(Flag.V)
  }
}

export class BLTConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BLT'
  public pattern: string = '11011011XXXXXXXX'
  protected conditionNumber: number = 11
  protected checkFlags(registers: Registers): boolean {
    return registers.isFlagSet(Flag.N) !== registers.isFlagSet(Flag.V)
  }
}

export class BGTConditionalJumpInstruction extends ConditionalJumpInstruction {
  public name: string = 'BGT'
  public pattern: string = '11011100XXXXXXXX'
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
  public pattern: string = '11011101XXXXXXXX'
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
  public pattern: string = '11011110XXXXXXXX'
  protected conditionNumber: number = 14
  protected checkFlags(registers: Registers): boolean {
    return true
  }
}
