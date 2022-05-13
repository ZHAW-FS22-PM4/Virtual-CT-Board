import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import { CmnInstruction } from 'instruction/instructions/compare/cmn'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const cmnInstruction = new CmnInstruction()

beforeEach(() => {
  registers.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0x01))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x02))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0xffffffff))
  registers.writeRegister(Register.R4, Word.fromUnsignedInteger(0x7fffffff))
})

describe('test encodeInstruction function for CMN', () => {
  it('should create correct opcode for CMN R0, R7', () => {
    let registerArray = ['R0', 'R7']
    let opcode = cmnInstruction.encodeInstruction(registerArray)
    expect(opcode[0].toBinaryString()).toEqual('0100001011111000')
  })

  it('should create correct opcode for CMN R7, R1', () => {
    let registerArray = ['R7', 'R1']
    let opcode = cmnInstruction.encodeInstruction(registerArray)
    expect(opcode[0].toBinaryString()).toEqual('0100001011001111')
  })

  it('should throw error for CMN R1, R8 because of high register', () => {
    let registerArray = ['R1', 'R8']
    expect(() => cmnInstruction.encodeInstruction(registerArray)).toThrow()
  })

  it('should throw error for CMn R1, R2, R3 because of too many params', () => {
    let registerArray = ['R1', 'R2', 'R3']
    expect(() => cmnInstruction.encodeInstruction(registerArray)).toThrow()
  })
})

describe('test executeInstruction function for CMN', () => {
  it('should return correct result for CMN R1, R2; R1 = 0x01, R2 = 0x02', () => {
    let registerArray = ['R1', 'R2']
    let opcode = cmnInstruction.encodeInstruction(registerArray)
    cmnInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toEqual(0x02)
    expect(registers.readRegister(Register.R1).value).toEqual(0x01)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })

  it('should return correct result for CMP R1, R3; R1 = 0x01, R3 = 0xffffffff', () => {
    let registerArray = ['R1', 'R3']
    let opcode = cmnInstruction.encodeInstruction(registerArray)
    cmnInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x01)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })

  it('should return correct result for CMP R1, R4; R1 = 0x01, R4 = 0x7fffffff', () => {
    let registerArray = ['R1', 'R4']
    let opcode = cmnInstruction.encodeInstruction(registerArray)
    cmnInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x01)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeTruthy()
  })

  it('should return correct result for CMP R3, R4; R3 = 0xffffffff, R4 = 0x7fffffff', () => {
    let registerArray = ['R3', 'R4']
    let opcode = cmnInstruction.encodeInstruction(registerArray)
    cmnInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R3).value).toEqual(0xffffffff)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeTruthy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })
})
