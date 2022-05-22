import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import {
  SubsImmediate3Instruction,
  SubsImmediate8Instruction,
  SubsRegistersInstruction
} from 'instruction/instructions/subtract/subs'
import InstructionSet from 'instruction/set'
import { Halfword, Word } from 'types/binary'

const name = 'SUBS'

const registers = new Registers()
const memory = new Memory()

const subsReg = new SubsRegistersInstruction()
const subsImm3 = new SubsImmediate3Instruction()
const subsImm8 = new SubsImmediate8Instruction()

beforeEach(function () {
  memory.reset()
  registers.reset()

  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(2))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(4))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(16))
})

describe('test canEncodeInstruction() function', () => {
  it('should return true for SubsRegistersInstruction and false for the others', () => {
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
  it('should return true for SubsImmediate3Instruction and false for the others', () => {
    expect(subsImm3.canEncodeInstruction('SUBS', ['R0', 'R1', '#3'])).toBe(true)
    expect(subsImm8.canEncodeInstruction('SUBS', ['R0', 'R1', '#3'])).toBe(
      false
    )
    expect(subsReg.canEncodeInstruction('SUBS', ['R0', 'R1', '#3'])).toBe(false)
  })
  it('should return true for SubsImmediate8Instruction and false for the others', () => {
    expect(subsImm8.canEncodeInstruction('SUBS', ['R0', '#25'])).toBe(true)
    expect(subsImm3.canEncodeInstruction('SUBS', ['R0', '#25'])).toBe(false)
    expect(subsReg.canEncodeInstruction('SUBS', ['R0', '#25'])).toBe(false)
  })
})

describe('test encodeInstruction() function', () => {
  it('should encode given arguments correctly', () => {
    expect(subsReg.encodeInstruction(['R0', 'R0', 'R1'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0x1a40)
    )
    expect(subsReg.encodeInstruction(['R0', 'R1'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0x1a40)
    )
    expect(subsImm3.encodeInstruction(['R0', 'R1', '#1'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0x1e48)
    )
    expect(subsImm8.encodeInstruction(['R0', '#1'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0x3801)
    )
  })
  it('should throw exception for high registers', () => {
    expect(() => subsReg.encodeInstruction(['R12', 'R0', 'R0'])).toThrow()
    expect(() => subsReg.encodeInstruction(['R0', 'R12', 'R0'])).toThrow()
    expect(() => subsReg.encodeInstruction(['R0', 'R0', 'R12'])).toThrow()
    expect(() => subsImm3.encodeInstruction(['R12', 'R0', '#1'])).toThrow()
    expect(() => subsImm3.encodeInstruction(['R0', 'R12', '#1'])).toThrow()
    expect(() => subsImm8.encodeInstruction(['R12', '#1'])).toThrow()
  })
  it('should throw exception for immediate values higher than 3 bits', () => {
    expect(() => subsImm3.encodeInstruction(['R12', 'R0', '#10'])).toThrow()
  })
  it('should throw exception for immediate values higher than 8 bits', () => {
    expect(() => subsImm8.encodeInstruction(['R12', '#256'])).toThrow()
    expect(() => subsImm8.encodeInstruction(['R12', '#500'])).toThrow()
  })
})

describe('test executeInstruction() method', function () {
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
