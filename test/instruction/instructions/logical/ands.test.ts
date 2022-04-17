import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { Word } from 'types/binary'
import {AndsInstruction} from "../../../../src/instruction/instructions/logical/ands";

const registers = new Registers()
const memory = new Memory()

const andsInstruction = new AndsInstruction()

beforeEach(function () {
  registers.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0x00a4))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x12345678))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0xfedcba98))
  registers.writeRegister(Register.R4, Word.fromUnsignedInteger(0x77777777))
  registers.writeRegister(Register.R8, Word.fromUnsignedInteger(0xb316))
})

describe('test canEncodeInstruction function for ANDS', () => {
  // todo All tests need to be written
  it('should encodeInstruction ', () => {
    let opcode = andsInstruction.encodeInstruction(['R1', 'R7', 'R7'], {})
    expect(opcode.toBinaryString()).toEqual('0100000000111001')
  })

  it('should throw an error for 2 params', () => {
    expect(() =>
        andsInstruction.encodeInstruction(['R1', 'R7'], {})
    ).toThrow()
  })

  it('should throw an error for high register params', () => {
    expect(() =>
        andsInstruction.encodeInstruction(['R1', 'R8', 'R8'], {})
    ).toThrow()
  })
})

describe('test encodeInstruction function for ANDS', () => {
  it('should create correct opcode for ANDS R1, R7', () => {
    let opcode = andsInstruction.encodeInstruction(['R1', 'R7', 'R7'], {})
    expect(opcode.toBinaryString()).toEqual('0100000000111001')
  })

  it('should throw an error for 2 params', () => {
    expect(() =>
      andsInstruction.encodeInstruction(['R1', 'R7'], {})
    ).toThrow()
  })

  it('should throw an error for high register params', () => {
    expect(() =>
        andsInstruction.encodeInstruction(['R1', 'R8', 'R8'], {})
    ).toThrow()
  })
})

describe('test executeInstruction function for ANDS', () => {
  it('should return correct value from register for ANDS R1, R2,', () => {
    let opcode = andsInstruction.encodeInstruction(['R1', 'R2'], {})
    andsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0xb3ba)

    // todo tests write for zero flag and signed flag
  })
})
