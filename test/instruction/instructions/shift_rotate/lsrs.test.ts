import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import {
  LsrsImmediateInstruction,
  LsrsRegisterInstruction
} from 'instruction/instructions/shift_rotate/lsrs'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const lsrsRegisterInstruction = new LsrsRegisterInstruction()
const lsrsImmediateInstruction = new LsrsImmediateInstruction()

beforeEach(() => {
  registers.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0xffffffff))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x01))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(32))
  registers.writeRegister(Register.R4, Word.fromUnsignedInteger(0xf0000000))
  registers.writeRegister(Register.R5, Word.fromUnsignedInteger(33))
  registers.writeRegister(Register.R6, Word.fromUnsignedInteger(31))
  registers.writeRegister(Register.R7, Word.fromUnsignedInteger(0))
})

describe('test encodeInstruction function for LSRS with registers', () => {
  it('should create correct opcode for LSRS R1, R1, R2', () => {
    let registerArray = ['R1', 'R1', 'R2']
    let opcode = lsrsRegisterInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0100000011010001')
  })

  it('should create correct opcode for LSRS R2, R2, R1', () => {
    let registerArray = ['R2', 'R2', 'R1']
    let opcode = lsrsRegisterInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0100000011001010')
  })

  it('should create correct opcode for LSRS R1, R2', () => {
    let registerArray = ['R1', 'R2']
    let opcode = lsrsRegisterInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0100000011010001')
  })

  it('should throw error for LSRS R1, R1, R8 because of high register', () => {
    let registerArray = ['R1', 'R1', 'R8']
    expect(() =>
      lsrsRegisterInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })

  it('should throw error for LSRS R1, R2, R3 because of non-identical params 0 and 1', () => {
    let registerArray = ['R1', 'R2', 'R3']
    expect(() =>
      lsrsRegisterInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })
})

describe('test executeInstruction function for LSRS with registers', () => {
  it('should return correct result for low register value as shifter (LSRS R1, R1, R2; R1 = 0xffffffff, R2 = 1)', () => {
    let registerArray = ['R1', 'R1', 'R2']
    let opcode = lsrsRegisterInstruction.encodeInstruction(registerArray, {})
    lsrsRegisterInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x7fffffff)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
  })

  it('should return correct result for shifting value = 32 (LSRS R4, R4, R3; R4 = 0xf0000000, R3 = 32)', () => {
    let registerArray = ['R4', 'R4', 'R3']
    let opcode = lsrsRegisterInstruction.encodeInstruction(registerArray, {})
    lsrsRegisterInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R4).value).toEqual(0x00)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
  })

  it('should return correct result for shifting value > 32 (LSRS R4, R4, R5; R4 = 0xf0000000, R5 = 33)', () => {
    let registerArray = ['R4', 'R4', 'R5']
    let opcode = lsrsRegisterInstruction.encodeInstruction(registerArray, {})
    lsrsRegisterInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R4).value).toEqual(0x00)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
  })

  it('should return correct result for shifting value = 31 (LSRS R4, R4, R6; R4 = 0xf0000000, R6 = 31)', () => {
    let registerArray = ['R4', 'R4', 'R6']
    let opcode = lsrsRegisterInstruction.encodeInstruction(registerArray, {})
    lsrsRegisterInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R4).value).toEqual(0x01)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
  })

  it('should return correct result for shifting value = 0 (LSRS R4, R4, R7; R4 = 0xf0000000, R7 = 0)', () => {
    let registerArray = ['R4', 'R4', 'R7']
    let opcode = lsrsRegisterInstruction.encodeInstruction(registerArray, {})
    lsrsRegisterInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R4).value).toEqual(0xf0000000)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
  })
})

describe('test encodeInstruction function for LSRS with immediate', () => {
  it('should create correct opcode for LSRS R1, R1, #1', () => {
    let registerArray = ['R1', 'R1', '#1']
    let opcode = lsrsImmediateInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0000100001001001')
  })

  it('should create correct opcode for LSRS R1, R2, #31', () => {
    let registerArray = ['R1', 'R2', '#31']
    let opcode = lsrsImmediateInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0000111111010001')
  })

  it('should throw error for LSRS R1, #1', () => {
    let registerArray = ['R1', '#1']
    let opcode = lsrsImmediateInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0000100001001001')
  })

  it('should throw error for LSRS R1, R8, #1 because of high register', () => {
    let registerArray = ['R1', 'R8', '#1']
    expect(() =>
      lsrsImmediateInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })

  it('should throw error for LSRS R1, R2, #32 because of immediate too big', () => {
    let registerArray = ['R1', 'R2', '#32']
    expect(() =>
      lsrsImmediateInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })
})

describe('test executeInstruction function for LSLS with immediate', () => {
  it('should return correct result for high register value (LSRS R2, R1, #4; R1 = 0xffffffff)', () => {
    let registerArray = ['R2', 'R1', '#4']
    let opcode = lsrsImmediateInstruction.encodeInstruction(registerArray, {})
    lsrsImmediateInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toEqual(0x0fffffff)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
  })

  it('should return correct result for low register value (LSRS R1, R2, #3; R2 = 1)', () => {
    let registerArray = ['R1', 'R2', '#3']
    let opcode = lsrsImmediateInstruction.encodeInstruction(registerArray, {})
    lsrsImmediateInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x00)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
  })

  it('should return correct result for highest possible immediate (LSRS R1, R1, #31; R1 = 0xffffffff)', () => {
    let registerArray = ['R1', 'R1', '#31']
    let opcode = lsrsImmediateInstruction.encodeInstruction(registerArray, {})
    lsrsImmediateInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x01)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
  })

  it('should return correct result for immediate zero (LSRS R1, R2, #0; R2 = 1)', () => {
    let registerArray = ['R1', 'R2', '#0']
    let opcode = lsrsImmediateInstruction.encodeInstruction(registerArray, {})
    expect(() =>
      lsrsImmediateInstruction.executeInstruction(opcode, registers, memory)
    ).toThrow()
  })
})
