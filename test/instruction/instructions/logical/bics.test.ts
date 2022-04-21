import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import { BicsInstruction } from 'instruction/instructions/logical/bics'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const bicsInstruction = new BicsInstruction()

beforeEach(function () {
  registers.reset()
  registers.writeRegister(
    Register.R1,
    Word.fromUnsignedInteger(0b00000000100010000000010010101101)
  )
  registers.writeRegister(
    Register.R2,
    Word.fromUnsignedInteger(0b00000000000000000000011110101011)
  )
  registers.writeRegister(
    Register.R3,
    Word.fromUnsignedInteger(0b00000000000000000000000000000000)
  )
  registers.writeRegister(
    Register.R4,
    Word.fromUnsignedInteger(0b00000000000000000000011110101011)
  )
  registers.writeRegister(
    Register.R5,
    Word.fromUnsignedInteger(0b10000000000001000010011110101011)
  )
  registers.writeRegister(
    Register.R6,
    Word.fromUnsignedInteger(0b00000000000000000000011110101011)
  )
  registers.writeRegister(Register.R8, Word.fromUnsignedInteger(0xb316))
})

describe('test canEncodeInstruction function for BICS', () => {
  it('should be able to encode instruction with correct register information', () => {
    expect(
      bicsInstruction.canEncodeInstruction('BICS', ['R1', 'R1', 'R7'])
    ).toBeTruthy()
  })

  it('should not be able to encode instruction with wrong register information', () => {
    expect(
      bicsInstruction.canEncodeInstruction('BICS', ['R1', 'R7', 'R7'])
    ).toBeFalsy()
  })

  it('should not be able to encode instruction with wrong register information', () => {
    expect(
      bicsInstruction.canEncodeInstruction('BICS', ['R1', 'R7'])
    ).toBeTruthy()
  })

  it('should not be able to encode instruction with wrong instruction name', () => {
    expect(
      bicsInstruction.canEncodeInstruction('BIC', ['R1', 'R1', 'R7'])
    ).toBeFalsy()
  })
})

describe('test encode instruction function for BICS', () => {
  it('should create correct opcode for BICS R1, R7', () => {
    let opcode = bicsInstruction.encodeInstruction(['R1', 'R7', 'R7'], {})
    expect(opcode.toBinaryString()).toEqual('0100001110111001')
  })

  it('should encode instruction as well with only two arguments', () => {
    let opcode = bicsInstruction.encodeInstruction(['R1', 'R7'], {})
    expect(opcode.toBinaryString()).toEqual('0100001110111001')
  })

  it('should throw an error for high register params', () => {
    expect(() =>
        bicsInstruction.encodeInstruction(['R1', 'R8', 'R8'], {})
    ).toThrow()
  })

  it('should throw an error for high register params', () => {
    expect(() =>
        bicsInstruction.encodeInstruction(['R1', 'R8'], {})
    ).toThrow()
  })
})

describe('test executeInstruction function for BICS', () => {
  it('should return correct value from register for BICS R1, R2,', () => {
    let opcode = bicsInstruction.encodeInstruction(['R1', 'R2', 'R2'], {})
    bicsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(
      0b00000000100010000000000000000100
    )
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
  })

  it('should return correct value from register for BICS R3, R4 and set Z flag', () => {
    let opcode = bicsInstruction.encodeInstruction(['R3', 'R4', 'R4'], {})
    bicsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R3).value).toEqual(
      0b00000000000000000000000000000000
    )
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy()
  })

  it('should return correct value from register for BICS R5, R6 and set N flag.,', () => {
    let opcode = bicsInstruction.encodeInstruction(['R5', 'R6', 'R6'], {})
    bicsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R5).value).toEqual(
      0b10000000000001000010000000000000
    )
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
  })
})
