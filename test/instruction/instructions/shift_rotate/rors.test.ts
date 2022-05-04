import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import { RorsInstruction } from 'instruction/instructions/shift_rotate/rors'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const rorsInstruction = new RorsInstruction()

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

describe('test encodeInstruction function for RORS', () => {
  it('should create correct opcode for RORS R1, R1, R2', () => {
    let registerArray = ['R1', 'R1', 'R2']
    let opcode = rorsInstruction.encodeInstruction(registerArray)
    expect(opcode[0].toBinaryString()).toEqual('0100000111010001')
  })

  it('should create correct opcode for RORS R2, R2, R1', () => {
    let registerArray = ['R2', 'R2', 'R1']
    let opcode = rorsInstruction.encodeInstruction(registerArray)
    expect(opcode[0].toBinaryString()).toEqual('0100000111001010')
  })

  it('should create correct opcode for RORS R1, R2', () => {
    let registerArray = ['R1', 'R2']
    let opcode = rorsInstruction.encodeInstruction(registerArray)
    expect(opcode[0].toBinaryString()).toEqual('0100000111010001')
  })

  it('should throw error for RORS R1, R1, R8 because of high register', () => {
    let registerArray = ['R1', 'R1', 'R8']
    expect(() => rorsInstruction.encodeInstruction(registerArray)).toThrow()
  })

  it('should throw error for RORS R1, R2, R3 because of non-identical params 0 and 1', () => {
    let registerArray = ['R1', 'R2', 'R3']
    expect(() => rorsInstruction.encodeInstruction(registerArray)).toThrow()
  })
})

describe('test executeInstruction function for RORS', () => {
  it('should return correct result for RORS R2, R2, R2; R2 = 1', () => {
    let registerArray = ['R2', 'R2', 'R2']
    let opcode = rorsInstruction.encodeInstruction(registerArray)
    rorsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toEqual(0x80000000)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
  })

  it('should return correct result for RORS R4, R4, R2; R4 = 0xf0000000, R2 = 1', () => {
    let registerArray = ['R4', 'R4', 'R2']
    let opcode = rorsInstruction.encodeInstruction(registerArray)
    rorsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R4).value).toEqual(0x78000000)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
  })

  it('should return correct result for shifting value = 32 (RORS R4, R4, R3; R4 = 0xf0000000, R3 = 32)', () => {
    let registerArray = ['R4', 'R4', 'R3']
    let opcode = rorsInstruction.encodeInstruction(registerArray)
    rorsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R4).value).toEqual(0xf0000000)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
  })

  it('should return correct result for shifting value > 32 (RORS R4, R4, R5; R4 = 0xf0000000, R5 = 33)', () => {
    let registerArray = ['R4', 'R4', 'R5']
    let opcode = rorsInstruction.encodeInstruction(registerArray)
    rorsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R4).value).toEqual(0x78000000)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
  })

  it('should return correct result for shifting value = 31 (RORS R4, R4, R6; R4 = 0xf0000000, R6 = 31)', () => {
    let registerArray = ['R4', 'R4', 'R6']
    let opcode = rorsInstruction.encodeInstruction(registerArray)
    rorsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R4).value).toEqual(0xe0000001)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
  })

  it('should return correct result for shifting value = 0 (RORS R4, R4, R7; R4 = 0xf0000000, R7 = 0)', () => {
    let registerArray = ['R4', 'R4', 'R7']
    let opcode = rorsInstruction.encodeInstruction(registerArray)
    rorsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R4).value).toEqual(0xf0000000)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
  })
})
