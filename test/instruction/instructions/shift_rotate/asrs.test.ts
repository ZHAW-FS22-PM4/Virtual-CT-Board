import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import {
  AsrsImmediateInstruction,
  AsrsRegisterInstruction
} from 'instruction/instructions/shift_rotate/asrs'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const asrsRegisterInstruction = new AsrsRegisterInstruction()
const asrsImmediateInstruction = new AsrsImmediateInstruction()

beforeEach(() => {
  registers.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0xf0000000))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x01))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0x03))
})

describe('test encodeInstruction function for ASRS with registers', () => {
  it('should create correct opcode for ASRS R1, R1, R2', () => {
    let registerArray = ['R1', 'R1', 'R2']
    let opcode = asrsRegisterInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0100000100010001')
  })

  it('should create correct opcode for ASRS R2, R2, R1', () => {
    let registerArray = ['R2', 'R2', 'R1']
    let opcode = asrsRegisterInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0100000100001010')
  })

  it('should throw error for ASRS R1, R1, R8 because of high register', () => {
    let registerArray = ['R1', 'R1', 'R8']
    expect(() =>
      asrsRegisterInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })

  it('should throw error for ASRS R1, R2, R3 because of non-identical params 0 and 1', () => {
    let registerArray = ['R1', 'R2', 'R3']
    expect(() =>
      asrsRegisterInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })

  it('should throw error for ASRS R1, R1 because of too few params', () => {
    let registerArray = ['R1', 'R1']
    expect(() =>
      asrsRegisterInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })
})

describe('test executeInstruction function for ASRS with registers', () => {
  it('should return correct result for ASRS R1, R1, R2; R1 = 0xf0000000, R2 = 1', () => {
    let registerArray = ['R1', 'R1', 'R2']
    let opcode = asrsRegisterInstruction.encodeInstruction(registerArray, {})
    asrsRegisterInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0xf8000000)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
  })

  it('should return correct result for ASRS R2, R2, R3; R2 = 1, R3 = 3', () => {
    let registerArray = ['R2', 'R2', 'R3']
    let opcode = asrsRegisterInstruction.encodeInstruction(registerArray, {})
    asrsRegisterInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toEqual(0x00)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
  })
})

describe('test encodeInstruction function for ASRS with immediate', () => {
  it('should create correct opcode for ASRS R1, R1, #1', () => {
    let registerArray = ['R1', 'R1', '#1']
    let opcode = asrsImmediateInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0001000001001001')
  })

  it('should create correct opcode for ASRS R1, R2, #31', () => {
    let registerArray = ['R1', 'R2', '#31']
    let opcode = asrsImmediateInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0001011111010001')
  })

  it('should throw error for ASRS R1, R8, #1 because of high register', () => {
    let registerArray = ['R1', 'R8', '#1']
    expect(() =>
      asrsImmediateInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })

  it('should throw error for ASRS R1, R2, #32 because of immediate too big', () => {
    let registerArray = ['R1', 'R2', '#32']
    expect(() =>
      asrsImmediateInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })

  it('should throw error for ASRS R1, #1 because of too few params', () => {
    let registerArray = ['R1', '#1']
    expect(() =>
      asrsImmediateInstruction.encodeInstruction(registerArray, {})
    ).toThrow()
  })
})

describe('test executeInstruction function for ASRS with immediate', () => {
  it('should return correct result for ASRS R2, R1, #4; R1 = 0xf0000000', () => {
    let registerArray = ['R2', 'R1', '#4']
    let opcode = asrsImmediateInstruction.encodeInstruction(registerArray, {})
    asrsImmediateInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toEqual(0xff000000)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
  })

  it('should return correct result for ASRS R1, R2, #1; R2 = 1', () => {
    let registerArray = ['R1', 'R2', '#1']
    let opcode = asrsImmediateInstruction.encodeInstruction(registerArray, {})
    asrsImmediateInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x00)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
  })
})

//TODO add tests with offset #0