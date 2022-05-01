import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import {
  CmpInstructionWithHighRegisters,
  CmpInstructionWithImmediateOffset,
  CmpInstructionWithLowRegisters
} from 'instruction/instructions/compare/cmp'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const cmpLowInstruction = new CmpInstructionWithLowRegisters()
const cmpHighInstruction = new CmpInstructionWithHighRegisters()
const cmpImmInstruction = new CmpInstructionWithImmediateOffset()

beforeEach(() => {
  registers.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0x01))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x02))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0x80000000))
  registers.writeRegister(Register.R8, Word.fromUnsignedInteger(0x01))
  registers.writeRegister(Register.R9, Word.fromUnsignedInteger(0x02))
  registers.writeRegister(Register.R10, Word.fromUnsignedInteger(0x80000000))
})

describe('test encodeInstruction function for CMP with low registers', () => {
  it('should create correct opcode for CMP R0, R7', () => {
    let registerArray = ['R0', 'R7']
    let opcode = cmpLowInstruction.encodeInstruction(registerArray)
    expect(opcode[0].toBinaryString()).toEqual('0100001010111000')
  })

  it('should create correct opcode for CMP R7, R1', () => {
    let registerArray = ['R7', 'R1']
    let opcode = cmpLowInstruction.encodeInstruction(registerArray)
    expect(opcode[0].toBinaryString()).toEqual('0100001010001111')
  })

  it('should throw error for CMP R1, R8 because of high register', () => {
    let registerArray = ['R1', 'R8']
    expect(() => cmpLowInstruction.encodeInstruction(registerArray)).toThrow()
  })

  it('should throw error for CMP R1, R2, R3 because of too many params', () => {
    let registerArray = ['R1', 'R2', 'R3']
    expect(() => cmpLowInstruction.encodeInstruction(registerArray)).toThrow()
  })
})

/////////////////////////////////////////

describe('test executeInstruction function for CMP with low registers', () => {
  it('should return correct result for CMP R1, R2; R1 = 0x01, R2 = 0x02', () => {
    let registerArray = ['R1', 'R2']
    let opcode = cmpLowInstruction.encodeInstruction(registerArray)
    cmpLowInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toEqual(0x02)
    expect(registers.readRegister(Register.R1).value).toEqual(0x01)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })

  it('should return correct result for CMP R2, R1; R1 = 0x01, R2 = 0x02', () => {
    let registerArray = ['R2', 'R1']
    let opcode = cmpLowInstruction.encodeInstruction(registerArray)
    cmpLowInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toEqual(0x02)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })

  it('should return correct result for CMP R1, R3; R1 = 0x01, R3 = 0x80000000', () => {
    let registerArray = ['R1', 'R3']
    let opcode = cmpLowInstruction.encodeInstruction(registerArray)
    cmpLowInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x01)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeTruthy()
  })

  it('should return correct result for CMP R3, R1; R1 = 0x01, R3 = 0x80000000', () => {
    let registerArray = ['R3', 'R1']
    let opcode = cmpLowInstruction.encodeInstruction(registerArray)
    cmpLowInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R3).value).toEqual(0x80000000)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
    expect(registers.isFlagSet(Flag.V)).toBeTruthy()
  })
})

describe('test encodeInstruction function for CMP with high registers', () => {
  it('should create correct opcode for CMP R0, R7', () => {
    let registerArray = ['R0', 'R7']
    let opcode = cmpHighInstruction.encodeInstruction(registerArray)
    expect(opcode[0].toBinaryString()).toEqual('0100010100111000')
  })

  it('should create correct opcode for CMP R10, R8', () => {
    let registerArray = ['R10', 'R8']
    let opcode = cmpHighInstruction.encodeInstruction(registerArray)
    expect(opcode[0].toBinaryString()).toEqual('0100010111000010')
  })

  it('should throw error for CMP R1, R16 because of register too high', () => {
    let registerArray = ['R1', 'R16']
    expect(() => cmpHighInstruction.encodeInstruction(registerArray)).toThrow()
  })

  it('should throw error for CMP R15, R14, R0 because of too many params', () => {
    let registerArray = ['R15', 'R14', 'R0']
    expect(() => cmpHighInstruction.encodeInstruction(registerArray)).toThrow()
  })
})

/////////////////////////////////

describe('test executeInstruction function for CMP with high registers', () => {
  it('should return correct result for CMP R8, R9; R8 = 0x01, R9 = 0x02', () => {
    let registerArray = ['R8', 'R9']
    let opcode = cmpHighInstruction.encodeInstruction(registerArray)
    cmpHighInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R9).value).toEqual(0x02)
    expect(registers.readRegister(Register.R8).value).toEqual(0x01)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })

  it('should return correct result for CMP R9, R8; R8 = 0x01, R9 = 0x02', () => {
    let registerArray = ['R9', 'R8']
    let opcode = cmpHighInstruction.encodeInstruction(registerArray)
    cmpHighInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R9).value).toEqual(0x02)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })

  it('should return correct result for CMP R8, R10; R8 = 0x01, R10 = 0x80000000', () => {
    let registerArray = ['R8', 'R10']
    let opcode = cmpHighInstruction.encodeInstruction(registerArray)
    cmpHighInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R8).value).toEqual(0x01)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeTruthy()
  })

  it('should return correct result for CMP R10, R8; R8 = 0x01, R10 = 0x80000000', () => {
    let registerArray = ['R10', 'R8']
    let opcode = cmpHighInstruction.encodeInstruction(registerArray)
    cmpHighInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R10).value).toEqual(0x80000000)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
    expect(registers.isFlagSet(Flag.V)).toBeTruthy()
  })
})

describe('test encodeInstruction function for CMP with immediate', () => {
  it('should create correct opcode for CMP R0, #0', () => {
    let registerArray = ['R0', '#0']
    let opcode = cmpImmInstruction.encodeInstruction(registerArray)
    expect(opcode[0].toBinaryString()).toEqual('0010100000000000')
  })

  it('should create correct opcode for CMP R7, #255', () => {
    let registerArray = ['R7', '#255']
    let opcode = cmpImmInstruction.encodeInstruction(registerArray)
    expect(opcode[0].toBinaryString()).toEqual('0010111111111111')
  })

  it('should throw error for CMP R8, #0 because of high register', () => {
    let registerArray = ['R8', '#0']
    expect(() => cmpImmInstruction.encodeInstruction(registerArray)).toThrow()
  })

  it('should throw error for CMP R1, R2, R3 because of too many params', () => {
    let registerArray = ['R1', 'R2', '#0']
    expect(() => cmpImmInstruction.encodeInstruction(registerArray)).toThrow()
  })
})

describe('test executeInstruction function for CMP with immediate', () => {
  it('should return correct result for CMP R1, #2; R1 = 0x01', () => {
    let registerArray = ['R1', '#2']
    let opcode = cmpImmInstruction.encodeInstruction(registerArray)
    cmpImmInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x01)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })

  it('should return correct result for CMP R2, #1; R2 = 0x02', () => {
    let registerArray = ['R2', '#1']
    let opcode = cmpImmInstruction.encodeInstruction(registerArray)
    cmpImmInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toEqual(0x02)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })

  it('should return correct result for CMP R1, #255; R1 = 0x01', () => {
    let registerArray = ['R1', '#255']
    let opcode = cmpImmInstruction.encodeInstruction(registerArray)
    cmpImmInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x01)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })

  it('should return correct result for CMP R3, #1; R3 = 0x80000000', () => {
    let registerArray = ['R3', '#1']
    let opcode = cmpImmInstruction.encodeInstruction(registerArray)
    cmpImmInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R3).value).toEqual(0x80000000)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
    expect(registers.isFlagSet(Flag.V)).toBeTruthy()
  })
})
