import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
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
    let opcode = rorsInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0100000111010001')
  })

  it('should create correct opcode for RORS R2, R2, R1', () => {
    let registerArray = ['R2', 'R2', 'R1']
    let opcode = rorsInstruction.encodeInstruction(registerArray, {})
    expect(opcode.toBinaryString()).toEqual('0100000111001010')
  })

  it('should throw error for RORS R1, R1, R8 because of high register', () => {
    let registerArray = ['R1', 'R1', 'R8']
    expect(() => rorsInstruction.encodeInstruction(registerArray, {})).toThrow()
  })

  it('should throw error for RORS R1, R2, R3 because of non-identical params 0 and 1', () => {
    let registerArray = ['R1', 'R2', 'R3']
    expect(() => rorsInstruction.encodeInstruction(registerArray, {})).toThrow()
  })

  it('should throw error for RORS R1, R1 because of too few params', () => {
    let registerArray = ['R1', 'R1']
    expect(() => rorsInstruction.encodeInstruction(registerArray, {})).toThrow()
  })
})
