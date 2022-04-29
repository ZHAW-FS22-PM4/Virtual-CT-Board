import { Memory } from 'board/memory'
import { Registers } from 'board/registers'
import {
  CmpInstructionWithHighRegisters,
  CmpInstructionWithImmediateOffset,
  CmpInstructionWithLowRegisters
} from 'instruction/instructions/compare/cmp'

const registers = new Registers()
const memory = new Memory()

const cmpLowInstruction = new CmpInstructionWithLowRegisters()
const cmpHighInstruction = new CmpInstructionWithHighRegisters()
const cmpImmInstruction = new CmpInstructionWithImmediateOffset()

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
