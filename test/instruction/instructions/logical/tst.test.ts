import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import { TstInstruction } from 'instruction/instructions/logical/tst'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const tstInstruction = new TstInstruction()

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
    Word.fromUnsignedInteger(0b00000000000000000000011110101011)
  )
  registers.writeRegister(
    Register.R4,
    Word.fromUnsignedInteger(0b00000000000000000000000000000000)
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

describe('test canEncodeInstruction function for TST', () => {
  it('should encode be able to instruction with correct register information', () => {
    expect(
      tstInstruction.canEncodeInstruction('TST', ['R1', 'R7'])
    ).toBeTruthy()
  })

  it('should not be able to encode instruction with wrong instruction name', () => {
    expect(
      tstInstruction.canEncodeInstruction('TSTS', ['R1', 'R1', 'R7'])
    ).toBeFalsy()
  })
})

describe('test encode instruction function for TST', () => {
  it('should create correct opcode for TST R1, R7', () => {
    let opcode = tstInstruction.encodeInstruction(['R1', 'R7'])
    expect(opcode[0].toBinaryString()).toEqual('0100001000111001')
  })

  it('should throw an error for 3 params', () => {
    expect(() => tstInstruction.encodeInstruction(['R1', 'R1', 'R7'])).toThrow()
  })

  it('should throw an error for high register params', () => {
    expect(() => tstInstruction.encodeInstruction(['R1', 'R8'])).toThrow()
  })
})

describe('test executeInstruction function for TST', () => {
  it('should return correct value from register for TST R1, R2,', () => {
    let opcode = tstInstruction.encodeInstruction(['R1', 'R2'])
    tstInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(
      0b00000000000000000000010010101101
    )
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
  })

  it('should return correct value from register for TST R3, R4 and set Z flag', () => {
    let opcode = tstInstruction.encodeInstruction(['R3', 'R4'])
    tstInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R3).value).toEqual(
      0b00000000000000000000011110101011
    )
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy()
  })

  it('should return correct value from register for TST R5, R6 and set N flag.,', () => {
    let opcode = tstInstruction.encodeInstruction(['R5', 'R6'])
    tstInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R5).value).toEqual(
      0b10000000000001000010011110101011
    )
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
  })
})
