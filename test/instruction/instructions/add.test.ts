import { Halfword, Word } from 'types/binary'
import {
  AddInstruction,
  AddsImmediate3Instruction,
  AddsImmediate8Instruction,
  AddsRegistersInstruction
} from 'instruction/instructions/add'
import { Flag, Register, Registers } from 'board/registers'
import { Memory } from 'board/memory'

const registers = new Registers()
const memory = new Memory()

const addInstruction = new AddInstruction()
const addsRegistersInstruction = new AddsRegistersInstruction()
const addsImmediate3Instruction = new AddsImmediate3Instruction()
const addsImmediate8Instruction = new AddsImmediate8Instruction()

beforeEach(function () {
  registers.clear()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0x00a4))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x12345678))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0xfedcba98))
  registers.writeRegister(Register.R4, Word.fromUnsignedInteger(0x77777777))
  registers.writeRegister(Register.R8, Word.fromUnsignedInteger(0xb316))
})

describe('test encodeInstruction function for ADD', () => {
  it('should create correct opcode for ADD R1, R8', () => {
    let opcode = addInstruction.encodeInstruction(['R1', 'R8'], {})
    expect(opcode.toBinaryString()).toEqual('0100010001000001')
  })

  it('should create correct opcode for ADD R8, R1', () => {
    let opcode = addInstruction.encodeInstruction(['R8', 'R1'], {})
    expect(opcode.toBinaryString()).toEqual('0100010010001000')
  })

  it('should throw an error for 3 params', () => {
    expect(() =>
      addInstruction.encodeInstruction(['R1', 'R1', 'R1'], {})
    ).toThrow()
  })
})

describe('test executeInstruction function for ADD', () => {
  it('should return correct value from register for ADD R1, R8, opcode 0100010001000001', () => {
    let opcode = addInstruction.encodeInstruction(['R1', 'R8'], {})
    addInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0xb3ba)
    //expect(registers.setFlags()).not.toHaveBeenCalled()
  })
})

describe('test encodeInstruction function for ADDS registers only', () => {
  it('should create correct opcode for ADDS R1, R2, R3', () => {
    let registerArray = ['R1', 'R2', 'R3']
    let opcode = addsRegistersInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0001100011010001')
  })

  it('should create correct opcode for ADDS R1, R2', () => {
    let registerArray = ['R1', 'R2']
    let opcode = addsRegistersInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0001100010001001')
  })

  it('should throw error for ADDS R1, R8, R1 because of high register', () => {
    expect(() =>
      addsRegistersInstruction.encodeInstruction(['R1', 'R8', 'R1'], {})
    ).toThrow()
  })
})

describe('test executeInstruction function for ADDS registers only', () => {
  it('should return correct value from register for ADDS R1, R2, R3; opcode 0001100011010001', () => {
    let registerArray = ['R1', 'R2', 'R3']
    let opcode = addsRegistersInstruction.encodeInstruction(registerArray, {})
    addsRegistersInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x11111110)
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })

  it('should return correct value from register for ADDS R1, R2; opcode 0001100010001001', () => {
    let registerArray = ['R1', 'R2']
    let opcode = addsRegistersInstruction.encodeInstruction(registerArray, {})
    addsRegistersInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x1234571c)
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })
})

describe('test encodeInstruction function for ADDS immediate 3', () => {
  it('should create correct opcode for ADDS R1, R2, #0x01', () => {
    let registerArray = ['R1', 'R2', '#0x01']
    let opcode = addsImmediate3Instruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0001110001010001')
  })

  it('should throw error for ADDS R1, R1, #0x01 because of same register', () => {
    expect(() =>
      addsImmediate3Instruction.encodeInstruction(['R1', 'R1', '0x01'], {})
    ).toThrow()
  })

  it('should throw error for ADDS R1, R2, #0x08 because of out of range immediate', () => {
    expect(() =>
      addsImmediate3Instruction.encodeInstruction(['R1', 'R2', '0x08'], {})
    ).toThrow()
  })

  it('should throw error for ADDS R1, R8, #0x01 because of high register', () => {
    expect(() =>
      addsImmediate3Instruction.encodeInstruction(['R1', 'R8', '0x01'], {})
    ).toThrow()
  })
})

describe('test executeInstruction function for ADDS immediate 3', () => {
  it('should return correct value from register for ADDS R1, R2, #0x01; opcode 0001110001010001', () => {
    let registerArray = ['R1', 'R2', '#0x01']
    let opcode = addsImmediate3Instruction.encodeInstruction(registerArray, {})
    addsImmediate3Instruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x12345679)
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })
})

describe('test encodeInstruction function for ADDS immediate 8', () => {
  it('should create correct opcode for ADDS R1, #240', () => {
    let registerArray = ['R1', '#240']
    let opcode = addsImmediate8Instruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0011000111110000')
  })

  it('should create correct opcode for ADDS R1, R1, #240', () => {
    let registerArray = ['R1', 'R1', '#240']
    let opcode = addsImmediate8Instruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0011000111110000')
  })

  it('should throw error for ADDS R1, R2, #0x01 because of different registers', () => {
    expect(() =>
      addsImmediate8Instruction.encodeInstruction(['R1', 'R2', '0x01'], {})
    ).toThrow()
  })

  it('should throw error for ADDS R1, #260 because of out of range immediate', () => {
    expect(() =>
      addsImmediate8Instruction.encodeInstruction(['R1', '#260'], {})
    ).toThrow()
  })

  it('should throw error for ADDS R8, R8, #0x01 because of high register', () => {
    expect(() =>
      addsImmediate8Instruction.encodeInstruction(['R8', 'R8', '0x01'], {})
    ).toThrow()
  })
})

describe('test executeInstruction function for ADDS immediate 8', () => {
  it('should return correct value from register for ADDS R1, #240; opcode 0011000111110000', () => {
    let registerArray = ['R1', '#240']
    let opcode = addsImmediate8Instruction.encodeInstruction(registerArray, {})
    addsImmediate8Instruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x194)
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })

  it('should return correct value from register for ADDS R1, R1, #240; opcode 0011000111110000', () => {
    let registerArray = ['R1', 'R1', '#240']
    let opcode = addsImmediate8Instruction.encodeInstruction(registerArray, {})
    addsImmediate8Instruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x194)
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })
})
