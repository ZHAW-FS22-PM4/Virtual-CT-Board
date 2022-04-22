import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import { AndsInstruction } from 'instruction/instructions/logical/ands'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const andsInstruction = new AndsInstruction()

beforeEach(function () {
  registers.reset()
  registers.writeRegister(
    Register.R1,
    Word.fromUnsignedInteger(0b00000000000000000000010010101101)
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
    Word.fromUnsignedInteger(0b10000000000000000000011110101011)
  )
  registers.writeRegister(Register.R8, Word.fromUnsignedInteger(0xb316))
})

describe('test canEncodeInstruction function for ANDS', () => {
  it('should encode be able to instruction with correct register information', () => {
    expect(
      andsInstruction.canEncodeInstruction('ANDS', ['R1', 'R1', 'R7'])
    ).toBeTruthy()
  })

  it('should not be able to encode instruction with wrong instruction name', () => {
    expect(
      andsInstruction.canEncodeInstruction('AND', ['R1', 'R1', 'R7'])
    ).toBeFalsy()
  })
})

describe('test encode instruction function for ANDS', () => {
  it('should create correct opcode for ANDS R1, R7', () => {
    let opcode = andsInstruction.encodeInstruction(['R1', 'R1', 'R7'], {})
    expect(opcode.toBinaryString()).toEqual('0100000000111001')
  })

  it('should encode instruction as well with only two arguments', () => {
    let opcode = andsInstruction.encodeInstruction(['R1', 'R7'], {})
    expect(opcode.toBinaryString()).toEqual('0100000000111001')
  })

  it('should throw an error for high register params', () => {
    expect(() =>
      andsInstruction.encodeInstruction(['R1', 'R1', 'R8'], {})
    ).toThrow()
  })

  it('should throw an error for high register params', () => {
    expect(() => andsInstruction.encodeInstruction(['R1', 'R8'], {})).toThrow()
  })
})

describe('test executeInstruction function for ANDS', () => {
  it('should return correct value from register for ANDS R1, R2,', () => {
    let opcode = andsInstruction.encodeInstruction(['R1', 'R1', 'R2'], {})
    andsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(
      0b00000000000000000000010010101001
    )
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
  })

  it('should return correct value from register for ANDS R3, R4 and set Z flag', () => {
    let opcode = andsInstruction.encodeInstruction(['R3', 'R3', 'R4'], {})
    andsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R3).value).toEqual(
      0b00000000000000000000000000000000
    )
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy()
  })

  it('should return correct value from register for ANDS R5, R6 and set N flag.,', () => {
    let opcode = andsInstruction.encodeInstruction(['R5', 'R5', 'R6'], {})
    andsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R5).value).toEqual(
      0b10000000000000000000011110101011
    )
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
  })
})
