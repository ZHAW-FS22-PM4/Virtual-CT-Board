import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import {
  SubsImmediate3Instruction,
  SubsImmediate8Instruction,
  SubsRegistersInstruction
} from 'instruction/instructions/subtract/subs'
import { Word } from 'types/binary'

const name = 'SUBS'

const registers = new Registers()
const memory = new Memory()

const subsReg = new SubsRegistersInstruction()
const subsImm3 = new SubsImmediate3Instruction()
const subsImm8 = new SubsImmediate8Instruction()

beforeEach(function () {
  memory.reset()
  registers.reset()

  registers.writeRegister(Register.R0, Word.fromUnsignedInteger(10))
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(30))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(10))
})

describe('test canEncodeInstruction() function', () => {
  it('should return true for SubsRegistersInstruction', () => {
    expect(subsReg.canEncodeInstruction('SUBS', ['R0', 'R1'])).toBe(true)
    expect(subsReg.canEncodeInstruction('SUBS', ['R0', 'R1', 'R2'])).toBe(true)

    expect(subsImm3.canEncodeInstruction('SUBS', ['R0', 'R1'])).toBe(false)
    expect(subsImm3.canEncodeInstruction('SUBS', ['R0', 'R1', 'R2'])).toBe(
      false
    )

    expect(subsImm8.canEncodeInstruction('SUBS', ['R0', 'R1'])).toBe(false)
    expect(subsImm8.canEncodeInstruction('SUBS', ['R0', 'R1', 'R2'])).toBe(
      false
    )
  })
  it('should return true for SubsImmediate3Instruction', () => {
    expect(subsImm3.canEncodeInstruction('SUBS', ['R0', 'R1', '#3'])).toBe(true)

    expect(subsImm8.canEncodeInstruction('SUBS', ['R0', 'R1', '#3'])).toBe(
      false
    )

    expect(subsReg.canEncodeInstruction('SUBS', ['R0', 'R1', '#3'])).toBe(false)
  })
  it('should return true for SubsImmediate8Instruction', () => {
    expect(subsImm3.canEncodeInstruction('SUBS', ['R0', '#25'])).toBe(true)

    expect(subsImm8.canEncodeInstruction('SUBS', ['R0', '#25'])).toBe(false)

    expect(subsReg.canEncodeInstruction('SUBS', ['R0', '#25'])).toBe(false)
  })
})

describe('test encodeInstruction() function', () => {
  it('should encode given arguments correctly', () => {
    expect(subsReg.encodeInstruction(['R0', 'R0', 'R1'])).toBe([0x1a40])
    expect(subsReg.encodeInstruction(['R0', 'R1'])).toBe([0x1a40])
    expect(subsImm3.encodeInstruction(['R0', 'R1', '#1'])).toBe([0x1e48])
    expect(subsImm8.encodeInstruction(['R0', '#1'])).toBe([0x3801])
  })
  it('should throw exception for immediate values higher than 3 bits', () => {})
  it('should throw exception for immediate values higher than 8 bits', () => {})
})

describe('test onExecuteInstruction() function', () => {})

/*
describe('SUBS instruction', function () {
  it('should subtract register from register and store in another register', function () {
    const options = ['R1', 'R3', 'R2']
    const encoder = InstructionSet.getEncoder(name, options)
    const opcode = encoder.encodeInstruction(options, {})
    const executor = InstructionSet.getExecutor(opcode)
    executor.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toBe(12)
  })
  it('should subtract small immediate from register and store in another register', function () {
    const options = ['R2', 'R2', '#2']
    const encoder = InstructionSet.getEncoder(name, options)
    const opcode = encoder.encodeInstruction(options, {})
    const executor = InstructionSet.getExecutor(opcode)
    executor.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toBe(2)
  })
  it('should subtract large immediate from register and store in first register', function () {
    const options = ['R3', '#12']
    const encoder = InstructionSet.getEncoder(name, options)
    const opcode = encoder.encodeInstruction(options, {})
    const executor = InstructionSet.getExecutor(opcode)
    executor.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R3).value).toBe(4)
  })
})
*/
