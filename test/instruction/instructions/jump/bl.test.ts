import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { BlInstruction } from 'instruction/instructions/jump/bl'
import { Halfword, Word } from 'types/binary'

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

  it('should create correct opcode for BL label1 with offset 2103298', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromUnsignedInteger(2103298)
    })
    expect(opcode[0].toBinaryString()).toEqual('1111001000000001')
    expect(opcode[1].toBinaryString()).toEqual('1111110000000001')
  })

  it('should create correct opcode for BL label1 with offset -10', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromSignedInteger(-10)
    })
    expect(opcode[0].toBinaryString()).toEqual('1111011111111111')
    expect(opcode[1].toBinaryString()).toEqual('1111111111111011')
  })

  it('should create correct opcode for BL abc with offset -2 (all placeholders filled with 1)', () => {
    let opcode = blInstruction.encodeInstruction(['abc'], {
      abc: Word.fromSignedInteger(-2)
    })
    expect(opcode[0].toBinaryString()).toEqual('1111011111111111')
    expect(opcode[1].toBinaryString()).toEqual('1111111111111111')
  })

  it('should create correct opcode for B label1 with offset -16777216 (all placeholders except sign filled with 0)', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromSignedInteger(-16777216)
    })
    expect(opcode[0].toBinaryString()).toEqual('1111010000000000')
    expect(opcode[1].toBinaryString()).toEqual('1101000000000000')
  })

  it('should create correct opcode (placeholders) without label offsets', () => {
    let opcode = blInstruction.encodeInstruction(['label1'])
    expect(opcode[0].toBinaryString()).toEqual('1111000000000000')
    expect(opcode[1].toBinaryString()).toEqual('1111100000000000')
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

  it('should set the pc and lr registers to correct value after jumping twice with offset -20', () => {
    let opcode = blInstruction.encodeInstruction(['label1'], {
      label1: Word.fromSignedInteger(-20)
    })
    blInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.LR).value).toEqual(134217736)
    expect(registers.readRegister(Register.PC).value).toEqual(134217716)

    blInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.LR).value).toEqual(134217716)
    expect(registers.readRegister(Register.PC).value).toEqual(134217696)
  })

  it('should set the pc and lr registers to correct value with given opcode with offset 8', () => {
    // opcode = 1111000000000000'1111100000000100 representing an offset of 8
    let opcode = [
      Halfword.fromUnsignedInteger(61440),
      Halfword.fromUnsignedInteger(63492)
    ]
    blInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.LR).value).toEqual(134217736)
    expect(registers.readRegister(Register.PC).value).toEqual(134217744)
  })

  it('should set the pc and lr registers to correct value with given opcode with offset -20', () => {
    // opcode = 1111011111111111'1111111111110110 representing an offset of -20
    let opcode = [
      Halfword.fromUnsignedInteger(63487),
      Halfword.fromUnsignedInteger(65526)
    ]
    blInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.LR).value).toEqual(134217736)
    expect(registers.readRegister(Register.PC).value).toEqual(134217716)
  })
})
