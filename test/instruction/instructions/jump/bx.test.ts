import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { BxInstruction } from 'instruction/instructions/jump/bx'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const bxInstruction = new BxInstruction()

beforeEach(function () {
  registers.reset()
  registers.writeRegister(Register.PC, Word.fromUnsignedInteger(20))
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(25))
  registers.writeRegister(Register.R12, Word.fromUnsignedInteger(2))
})

describe('test encodeInstruction function for BX', () => {
  it('should create correct opcode for BX R1', () => {
    let opcode = bxInstruction.encodeInstruction(['R1'])
    expect(opcode[0].toBinaryString()).toEqual('0100011100001000')
  })

  it('should create correct opcode for BX R12', () => {
    let opcode = bxInstruction.encodeInstruction(['R12'])
    expect(opcode[0].toBinaryString()).toEqual('0100011101100000')
  })

  it('should create correct opcode for BX PC', () => {
    let opcode = bxInstruction.encodeInstruction(['PC'])
    expect(opcode[0].toBinaryString()).toEqual('0100011101111000')
  })

  it('should throw an error for 2 params', () => {
    expect(() => bxInstruction.encodeInstruction(['R1', 'R2'])).toThrow()
  })
})

describe('test onExecuteInstruction function for BX', () => {
  it('should set the pc register to correct value with R1', () => {
    let opcode = bxInstruction.encodeInstruction(['R1'])
    bxInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.PC).value).toEqual(25)
  })

  it('should set the pc register to correct value with R12', () => {
    let opcode = bxInstruction.encodeInstruction(['R12'])
    bxInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.PC).value).toEqual(2)
  })

  it('should set the pc register to correct value with PC', () => {
    let opcode = bxInstruction.encodeInstruction(['PC'])
    bxInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.PC).value).toEqual(20)
  })
})
