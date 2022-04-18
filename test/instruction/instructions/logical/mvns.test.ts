import { Memory } from 'board/memory'
import {Flag, Register, Registers} from 'board/registers'
import { Word } from 'types/binary'
import {MvnsInstruction} from "instruction/instructions/logical/mvns"

const registers = new Registers()
const memory = new Memory()

const mvnsInstruction = new MvnsInstruction()

beforeEach(function () {
  registers.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0b10000000000000000000010010101101))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0b10000000000000000000010010101101))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0b11111111111111111111111111111111))
  registers.writeRegister(Register.R4, Word.fromUnsignedInteger(0b11111111111111111111111111111111))
  registers.writeRegister(Register.R5, Word.fromUnsignedInteger(0b00000000000001000010011110101011))
  registers.writeRegister(Register.R6, Word.fromUnsignedInteger(0b00000000000001000010011110101011))
  registers.writeRegister(Register.R8, Word.fromUnsignedInteger(0xb316))
})

describe('test canEncodeInstruction function for MVNS', () => {
  it('should encode be able to instruction with correct register information', () => {
    expect(mvnsInstruction.canEncodeInstruction('MVNS',['R1', 'R7'])).toBeTruthy()
  })

  it('should not be able to encode instruction with wrong register information', () => {
    expect(mvnsInstruction.canEncodeInstruction('MVNS',['R1', 'R1', 'R7'])).toBeFalsy()
  })

  it('should not be able to encode instruction with wrong instruction name', () => {
    expect(mvnsInstruction.canEncodeInstruction('MVN',['R1', 'R1','R7'])).toBeFalsy()
  })

})

describe('test encode instruction function for MVNS', () => {
  it('should create correct opcode for MVNS R1, R7', () => {
    let opcode = mvnsInstruction.encodeInstruction(['R1', 'R7'], {})
    expect(opcode.toBinaryString()).toEqual('0100001111111001')
  })

  it('should throw an error for 3 params', () => {
    expect(() =>
      mvnsInstruction.encodeInstruction(['R1', 'R1', 'R7'], {})
    ).toThrow()
  })

  it('should throw an error for high register params', () => {
    expect(() =>
        mvnsInstruction.encodeInstruction(['R1', 'R8'], {})
    ).toThrow()
  })
})

describe('test executeInstruction function for MVNS', () => {
  it('should return correct value from register for MVNS R1, R2,', () => {
    let opcode = mvnsInstruction.encodeInstruction(['R1','R2'], {})
    mvnsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0b01111111111111111111101101010010)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
  })

  it('should return correct value from register for MVNS R3, R4 and set Z flag', () => {
    let opcode = mvnsInstruction.encodeInstruction(['R3', 'R4'], {})
    mvnsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R3).value).toEqual(0b00000000000000000000000000000000)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy()
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy()
  })

  it('should return correct value from register for MVNS R5, R6 and set N flag.,', () => {
    let opcode = mvnsInstruction.encodeInstruction(['R5','R6'], {})
    mvnsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R5).value).toEqual(0b11111111111110111101100001010100)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
  })
})
