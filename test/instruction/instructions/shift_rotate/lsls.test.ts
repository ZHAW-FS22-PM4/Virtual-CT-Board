import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import {
  LslsImmediateInstruction,
  LslsRegisterInstruction
} from 'instruction/instructions/shift_rotate/lsls'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const lslsRegisterInstruction = new LslsRegisterInstruction()
const lslsImmediateInstruction = new LslsImmediateInstruction()

beforeEach(() => {
  registers.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0xffffffff))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x01))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0x04))
})

describe('test encodeInstruction function for LSLS with registers', () => {
  it('should create correct opcode for LSLS R1, R1, R2', () => {
    let registerArray = ['R1', 'R1', 'R2']
    let opcode = lslsRegisterInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0100000010010001')
  })

  it('should create correct opcode for LSLS R2, R2, R1', () => {
    let registerArray = ['R2', 'R2', 'R1']
    let opcode = lslsRegisterInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0100000010001010')
  })

  it('should throw error for LSLS R1, R1, R8 because of high register', () => {
    let registerArray = ['R1', 'R1', 'R8']
    expect(() =>
      lslsRegisterInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })

  it('should throw error for LSLS R1, R2, R3 because of non-identical params 0 and 1', () => {
    let registerArray = ['R1', 'R2', 'R3']
    expect(() =>
      lslsRegisterInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })

  it('should throw error for LSLS R1, R1 because of too few params', () => {
    let registerArray = ['R1', 'R1']
    expect(() =>
      lslsRegisterInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })
})

describe('test executeInstruction function for LSLS with registers', () => {
  it('should return correct result for LSLS R1, R1, R2; R1 = 0xffffffff, R2 = 1', () => {
    let registerArray = ['R1', 'R1', 'R2']
    let opcode = lslsRegisterInstruction.encodeInstruction(registerArray, {})
    lslsRegisterInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0xfffffffe)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
  })

  it('should return correct result for LSLS R2, R2, R3; R2 = 1, R3 = 4', () => {
    let registerArray = ['R2', 'R2', 'R3']
    let opcode = lslsRegisterInstruction.encodeInstruction(registerArray, {})
    lslsRegisterInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toEqual(0x00000010)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
  })
})

describe('test encodeInstruction function for LSLS with immediate', () => {
  it('should create correct opcode for LSLS R1, R1, #1', () => {
    let registerArray = ['R1', 'R1', '#1']
    let opcode = lslsImmediateInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0000000001001001')
  })

  it('should create correct opcode for LSLS R1, R2, #31', () => {
    let registerArray = ['R1', 'R2', '#31']
    let opcode = lslsImmediateInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0000011111010001')
  })

  it('should throw error for LSLS R1, R8, #1 because of high register', () => {
    let registerArray = ['R1', 'R8', '#1']
    expect(() =>
      lslsImmediateInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })

  it('should throw error for LSLS R1, R2, #32 because of immediate too big', () => {
    let registerArray = ['R1', 'R2', '#32']
    expect(() =>
      lslsImmediateInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })

  it('should throw error for LSLS R1, #1 because of too few params', () => {
    let registerArray = ['R1', '#1']
    expect(() =>
      lslsImmediateInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })
})

describe('test executeInstruction function for LSLS with immediate', () => {
  it('should return correct result for LSLS R2, R1, #4; R1 = 0xffffffff', () => {
    let registerArray = ['R2', 'R1', '#4']
    let opcode = lslsImmediateInstruction.encodeInstruction(registerArray, {})
    lslsImmediateInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toEqual(0xfffffff0)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
  })

  it('should return correct result for LSLS R1, R2, #31; R2 = 1', () => {
    let registerArray = ['R1', 'R2', '#31']
    let opcode = lslsImmediateInstruction.encodeInstruction(registerArray, {})
    lslsImmediateInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x80000000)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
  })
})
