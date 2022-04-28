import { Register, Registers } from 'board/registers'
import { Memory } from 'board/memory'
import { Word } from 'types/binary'
import { BInstruction } from 'instruction/instructions/jump/b'

const registers = new Registers()
const memory = new Memory()

const bInstruction = new BInstruction()

beforeEach(function () {
  registers.reset()
  registers.writeRegister(Register.PC, Word.fromUnsignedInteger(20))
})

describe('test encodeInstruction function for B', () => {
  it('should create correct opcode for B label1 with offset 2', () => {
    let opcode = bInstruction.encodeInstruction(['label1'], {
      label1: Word.fromUnsignedInteger(2)
    })
    expect(opcode[0].toBinaryString()).toEqual('1110000000000010')
  })

  it('should create correct opcode for B label1 with offset 132', () => {
    let opcode = bInstruction.encodeInstruction(['label1'], {
      label1: Word.fromUnsignedInteger(132)
    })
    expect(opcode[0].toBinaryString()).toEqual('1110000010000100')
  })

  it('should create correct opcode for B label1 with offset -10', () => {
    let opcode = bInstruction.encodeInstruction(['label1'], {
      label1: Word.fromSignedInteger(-10)
    })
    expect(opcode[0].toBinaryString()).toEqual('1110011111110110')
  })

  it('should throw an error for 2 params', () => {
    expect(() => bInstruction.encodeInstruction(['label1', 'label2'])).toThrow()
  })
})

describe('test onExecuteInstruction function for B', () => {
  it('should set the pc register to correct value with offset 2', () => {
    let opcode = bInstruction.encodeInstruction(['label1'], {
      label1: Word.fromUnsignedInteger(2)
    })
    bInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.PC).value).toEqual(22)
  })

  it('should set the pc register to correct value with offset 132', () => {
    let opcode = bInstruction.encodeInstruction(['label1'], {
      label1: Word.fromUnsignedInteger(132)
    })
    bInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.PC).value).toEqual(152)
  })

  it('should set the pc register to correct value with offset -10', () => {
    let opcode = bInstruction.encodeInstruction(['label1'], {
      label1: Word.fromSignedInteger(-10)
    })
    bInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.PC).value).toEqual(10)
  })
})
