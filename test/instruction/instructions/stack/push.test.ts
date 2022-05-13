import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import { PushInstruction } from 'instruction/instructions/stack/push'
import { Halfword, Word } from 'types/binary'

const instr = new PushInstruction()

const registers: Registers = new Registers()
const memory: Memory = new Memory()

describe('test canEncodeInstruction (whether the class is responsible for this command) function', () => {
  test('PUSH instruction', () => {
    expect(instr.canEncodeInstruction('INVALID', ['{R2', 'R7}'])).toBe(false)
    expect(instr.canEncodeInstruction('PUSH', ['[R2', 'R7]'])).toBe(true)
    expect(instr.canEncodeInstruction('PUSH', ['R2}', '{R7}'])).toBe(true)
    expect(instr.canEncodeInstruction('PUSH', ['{R2', 'R7'])).toBe(true)
    expect(instr.canEncodeInstruction('PUSH', ['{R2', 'R7 }'])).toBe(true)
    expect(instr.canEncodeInstruction('PUSH', ['{R5', 'R5}'])).toBe(true)
    expect(instr.canEncodeInstruction('PUSH', ['{R2', 'LR', 'R7}'])).toBe(true)
    expect(instr.canEncodeInstruction('PUSH', ['{R2 -R6}'])).toBe(true)
    expect(instr.canEncodeInstruction('PUSH', ['{R3-R1}'])).toBe(true)
    expect(instr.canEncodeInstruction('PUSH', ['{R2- R6', 'R0}'])).toBe(true)
    expect(instr.canEncodeInstruction('PUSH', ['{ PC}'])).toBe(true)
    expect(instr.canEncodeInstruction('PUSH', ['{LR}'])).toBe(true)
    expect(
      instr.canEncodeInstruction('PUSH', [
        '{R5',
        'LR',
        'R1',
        'R7',
        'R6',
        'R0',
        'R3',
        'R2',
        'R4}'
      ])
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('PUSH', () => {
    expect(instr.encodeInstruction(['{R2', 'R7}'])[0].toBinaryString()).toEqual(
      '1011010010000100'
    )
    expect(instr.encodeInstruction(['{R5', 'R1}'])[0].toBinaryString()).toEqual(
      '1011010000100010'
    )
    expect(
      instr.encodeInstruction(['{ LR', 'R7}'])[0].toBinaryString()
    ).toEqual('1011010110000000')
    expect(instr.encodeInstruction(['{R0', 'LR}'])[0].toBinaryString()).toEqual(
      '1011010100000001'
    )
    expect(
      instr.encodeInstruction(['{  R3-R6', 'R0-R1}'])[0].toBinaryString()
    ).toEqual('1011010001111011')
    expect(
      instr.encodeInstruction(['{R2', 'R4', 'R6 }'])[0].toBinaryString()
    ).toEqual('1011010001010100')
    expect(
      instr.encodeInstruction(['{R3', 'LR', 'R7', 'R5}'])[0].toBinaryString()
    ).toEqual('1011010110101000')
    expect(instr.encodeInstruction(['{R2 -R6}'])[0].toBinaryString()).toEqual(
      '1011010001111100'
    )
    expect(instr.encodeInstruction(['{R0-R7}'])[0].toBinaryString()).toEqual(
      '1011010011111111'
    )
    expect(
      instr.encodeInstruction(['{R3- R3', 'R0}'])[0].toBinaryString()
    ).toEqual('1011010000001001')
    expect(instr.encodeInstruction(['{LR}'])[0].toBinaryString()).toEqual(
      '1011010100000000'
    )
    expect(
      instr
        .encodeInstruction([
          '{R5',
          'LR',
          'R1',
          'R7',
          'R6',
          'R0',
          'R3',
          'R2',
          'R4}'
        ])[0]
        .toBinaryString()
    ).toEqual('1011010111111111')

    expect(() => instr.encodeInstruction(['invalidOption'])).toThrow(
      InstructionError
    )
    expect(() => instr.encodeInstruction(['[R7', 'R5]'])).toThrow(
      InstructionError
    )
    expect(() => instr.encodeInstruction(['R2}', '{R7}'])).toThrow(
      InstructionError
    )
    expect(() => instr.encodeInstruction([])).toThrow(InstructionError)
    expect(() => instr.encodeInstruction(['{R2', 'R7'])).toThrow(
      InstructionError
    )
    expect(() => instr.encodeInstruction(['{R5', 'R5}'])).toThrow(
      InstructionError
    )
    expect(() => instr.encodeInstruction(['{PC}'])).toThrow(InstructionError)
    expect(() => instr.encodeInstruction(['{R6-R3}'])).toThrow(InstructionError)
    expect(() => instr.encodeInstruction(['{R8}'])).toThrow(InstructionError)
    expect(() => instr.encodeInstruction(['{R77}'])).toThrow(InstructionError)
  })
})

describe('test executeInstruction function', () => {
  test('PUSH instruction', () => {
    let stackAddress = Word.fromUnsignedInteger(0x2000199e)
    const value1 = Word.fromUnsignedInteger(0x22443355)
    const value2 = Word.fromUnsignedInteger(0x03050208)
    const value3 = Word.fromUnsignedInteger(0xe05011c0)
    const value4 = Word.fromUnsignedInteger(0x57382548)
    const value5 = Word.fromUnsignedInteger(0x03002405)
    registers.writeRegister(Register.SP, stackAddress)
    registers.writeRegister(Register.R0, value1)
    registers.writeRegister(Register.R1, value2)
    registers.writeRegister(Register.R2, value2)
    registers.writeRegister(Register.R5, value3)
    registers.writeRegister(Register.R7, value4)
    registers.writeRegister(Register.LR, value5)

    instr.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1011010000100010)], //PUSH {R1, R5}
      registers,
      memory
    )

    expect(memory.readWord(registers.readRegister(Register.SP))).toEqual(value2)
    expect(memory.readWord(registers.readRegister(Register.SP).add(4))).toEqual(
      value3
    )

    instr.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1011010110100001)], //PUSH {R0, LR, R7, R5}
      registers,
      memory
    )

    expect(memory.readWord(registers.readRegister(Register.SP))).toEqual(value1)
    expect(memory.readWord(registers.readRegister(Register.SP).add(4))).toEqual(
      value3
    )
    expect(memory.readWord(registers.readRegister(Register.SP).add(8))).toEqual(
      value4
    )
    expect(
      memory.readWord(registers.readRegister(Register.SP).add(12))
    ).toEqual(value5)

    instr.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1011010100000000)], //PUSH {LR}
      registers,
      memory
    )

    expect(memory.readWord(registers.readRegister(Register.SP))).toEqual(value5)

    instr.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1011010010000111)], //PUSH {R7, R0-R2}
      registers,
      memory
    )

    expect(memory.readWord(registers.readRegister(Register.SP))).toEqual(value1)
    expect(memory.readWord(registers.readRegister(Register.SP).add(4))).toEqual(
      value2
    )
    expect(memory.readWord(registers.readRegister(Register.SP).add(8))).toEqual(
      value2
    )
    expect(
      memory.readWord(registers.readRegister(Register.SP).add(12))
    ).toEqual(value4)
  })
})
