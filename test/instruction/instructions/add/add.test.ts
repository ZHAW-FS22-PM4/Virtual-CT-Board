import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { AddInstruction } from 'instruction/instructions/add/add'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const addInstruction = new AddInstruction()

beforeEach(function () {
  registers.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0x00a4))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x12345678))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0xfedcba98))
  registers.writeRegister(Register.R4, Word.fromUnsignedInteger(0x77777777))
  registers.writeRegister(Register.R8, Word.fromUnsignedInteger(0xb316))
})

describe('test encodeInstruction function for ADD', () => {
  it('should create correct opcode for ADD R1, R8', () => {
    let opcode = addInstruction.encodeInstruction(['R1', 'R8'], {})
    expect(opcode.toBinaryString()).toEqual('0100010001000001')
  })

  it('should create correct opcode for ADD R8, R1', () => {
    let opcode = addInstruction.encodeInstruction(['R8', 'R1'], {})
    expect(opcode.toBinaryString()).toEqual('0100010010001000')
  })

  it('should throw an error for 3 params', () => {
    expect(() =>
      addInstruction.encodeInstruction(['R1', 'R1', 'R1'], {})
    ).toThrow()
  })
})

describe('test executeInstruction function for ADD', () => {
  it('should return correct value from register for ADD R1, R8, opcode 0100010001000001', () => {
    let opcode = addInstruction.encodeInstruction(['R1', 'R8'], {})
    addInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0xb3ba)
    //expect(registers.setFlags()).not.toHaveBeenCalled()
  })
})
