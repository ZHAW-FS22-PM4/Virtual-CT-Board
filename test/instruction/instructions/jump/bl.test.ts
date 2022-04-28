import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { BlInstruction } from 'instruction/instructions/jump/bl'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const blInstruction = new BlInstruction()

beforeEach(function () {
  registers.reset()
  registers.writeRegister(Register.PC, Word.fromUnsignedInteger(134217736))
})

describe('test encodeInstruction function for BL', () => {
  it('should create correct opcode for BL label1 with offset 2', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromUnsignedInteger(2)
    })
    expect(opcode[0].toBinaryString()).toEqual('1111000000000000')
    expect(opcode[1].toBinaryString()).toEqual('1111100000000001')
  })

  it('should create correct opcode for BL label1 with offset 16777214', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromUnsignedInteger(16777214)
    })
    expect(opcode[0].toBinaryString()).toEqual('1111001111111111')
    expect(opcode[1].toBinaryString()).toEqual('1101011111111111')
  })

  it('should create correct opcode for BL label1 with offset -10', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromSignedInteger(-10)
    })
    expect(opcode[0].toBinaryString()).toEqual('1111011111111111')
    expect(opcode[1].toBinaryString()).toEqual('1111111111111011')
  })

  it('should create correct opcode for B label1 with offset -16777216', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromSignedInteger(-16777216)
    })
    expect(opcode[0].toBinaryString()).toEqual('1111010000000000')
    expect(opcode[1].toBinaryString()).toEqual('1101000000000000')
  })

  it('should throw an error for 2 params', () => {
    expect(() =>
      blInstruction.encodeInstruction(['label1', 'label2'])
    ).toThrow()
  })
})

describe('test onExecuteInstruction function for BL', () => {
  it('should set the pc and lr registers to correct value with offset 2', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromUnsignedInteger(2)
    })
    blInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.LR).value).toEqual(134217736)
    expect(registers.readRegister(Register.PC).value).toEqual(134217738)
  })

  it('should set the pc and lr registers to correct value with offset 16777214', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromUnsignedInteger(16777214)
    })
    blInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.LR).value).toEqual(134217736)
    expect(registers.readRegister(Register.PC).value).toEqual(150994950)
  })

  it('should set the pc and lr registers to correct value with offset -10', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromSignedInteger(-10)
    })
    blInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.LR).value).toEqual(134217736)
    expect(registers.readRegister(Register.PC).value).toEqual(134217726)
  })

  it('should set the pc and lr registers to correct value with offset -16777216', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromSignedInteger(-16777216)
    })
    blInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.LR).value).toEqual(134217736)
    expect(registers.readRegister(Register.PC).value).toEqual(117440520)
  })
})
