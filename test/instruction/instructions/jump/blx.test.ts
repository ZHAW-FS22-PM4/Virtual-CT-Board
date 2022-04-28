import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { BlxInstruction } from 'instruction/instructions/jump/blx'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const blxInstruction = new BlxInstruction()

beforeEach(function () {
  registers.reset()
  registers.writeRegister(Register.PC, Word.fromUnsignedInteger(20))
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(25))
  registers.writeRegister(Register.R12, Word.fromUnsignedInteger(2))
})

describe('test encodeInstruction function for BLX', () => {
  it('should create correct opcode for BLX R1', () => {
    let opcode = blxInstruction.encodeInstruction(['R1'])
    expect(opcode[0].toBinaryString()).toEqual('0100011110001000')
  })

  it('should create correct opcode for BLX R12', () => {
    let opcode = blxInstruction.encodeInstruction(['R12'])
    expect(opcode[0].toBinaryString()).toEqual('0100011111100000')
  })

  it('should create correct opcode for BLX PC', () => {
    let opcode = blxInstruction.encodeInstruction(['PC'])
    expect(opcode[0].toBinaryString()).toEqual('0100011111111000')
  })

  it('should throw an error for 2 params', () => {
    expect(() => blxInstruction.encodeInstruction(['R1', 'R2'])).toThrow()
  })
})

describe('test onExecuteInstruction function for BLX', () => {
  it('should set the pc and lr registers to correct value with R1', () => {
    let opcode = blxInstruction.encodeInstruction(['R1'])
    blxInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.LR).value).toEqual(18)
    expect(registers.readRegister(Register.PC).value).toEqual(25)
  })

  it('should set the pc and lr registers to correct value with R12', () => {
    let opcode = blxInstruction.encodeInstruction(['R12'])
    blxInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.LR).value).toEqual(18)
    expect(registers.readRegister(Register.PC).value).toEqual(2)
  })

  it('should set the pc and lr registers to correct value with PC', () => {
    let opcode = blxInstruction.encodeInstruction(['PC'])
    blxInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.LR).value).toEqual(18)
    expect(registers.readRegister(Register.PC).value).toEqual(20)
  })
})
