import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import {
  LdrhImmediate5OffsetInstruction,
  LdrhRegisterOffsetInstruction
} from 'instruction/instructions/load/ldrh'
import { Halfword, Word } from 'types/binary'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'

const invalidInstructionOptions = ['R77', '#2#']

const strName = 'LDR'
const strbName = 'LDRB'
const strhName = 'LDRH'

const strRegisterOptionsValid = ['R0', '[R1', 'R2]']
const strRegisterOptionsInvalid = ['R0', 'R1', 'R2']
const strRegisterOptionsInvalid2 = ['R0', 'R1]', '[R2']
const strLiteralOptionsValid = ['R0', '[R1', '#0xe6]']
const strLiteralOptionsInvalid = ['R0', 'R1', '#0xe6']
const strLiteralOptionsInvalid2 = ['R0', 'R1]', '[#0xe6']

const lowRegisterOption: string = 'R1'
const lowRegisterOption2: string = '[R2'
const lowRegisterOption3: string = 'R3]'
const validImmediateOptionLow: string = '#0x01]'
const validImmediateOptionHigh: string = '#0x1F'
const invalidImmediateOption: string = '5'

const highRegisterOption: string = 'SP'
const invalidRegisterOption: string = 'R22'

const instructionLoadInstructionImmediateOffsetHalfword =
  new LdrhImmediate5OffsetInstruction()
const instructionLoadInstructionRegisterOffsetHalfword =
  new LdrhRegisterOffsetInstruction()

const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR7: Word = Word.fromUnsignedInteger(0x00000000)
const registerValueR6: Word = Word.fromUnsignedInteger(0x12345678)
const registerValueR5: Word = Word.fromUnsignedInteger(0x00000100)

registers.writeRegister(Register.R7, registerValueR7)
registers.writeRegister(Register.R6, registerValueR6)
registers.writeRegister(Register.R5, registerValueR5)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('LOAD instruction - LDRH (immediate offset) - halfword encoder', () => {
    expect(
      instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strbName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsValid
      )
    ).toBe(true)
  })
  test('LOAD instruction - LDRH (register offset) - halfword encoder', () => {
    expect(
      instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strbName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('LdrhImmediate5OffsetInstruction', () => {
    // LDRH R1, [R2, #0x01]
    expect(
      instructionLoadInstructionImmediateOffsetHalfword
        .encodeInstruction([
          lowRegisterOption,
          lowRegisterOption2,
          validImmediateOptionLow
        ])[0]
        .toBinaryString()
    ).toEqual('1000100001010001')
    // LDRH R1, [R2, #0x1F]
    expect(
      instructionLoadInstructionImmediateOffsetHalfword
        .encodeInstruction([
          lowRegisterOption,
          lowRegisterOption2,
          validImmediateOptionHigh
        ])[0]
        .toBinaryString()
    ).toEqual('1000111111010001')
    // LDRH R1, [R2, R3]
    expect(() =>
      instructionLoadInstructionImmediateOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        lowRegisterOption3
      ])
    ).toThrow(InstructionError)
    // LDRH R5, [R2
    expect(() =>
      instructionLoadInstructionImmediateOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2
      ])
    ).toThrow(InstructionError)
    // LDRH R1, [R2, 5]
    expect(() =>
      instructionLoadInstructionImmediateOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        invalidImmediateOption
      ])
    ).toThrow(InstructionError)
    // LDRH R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionImmediateOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        validImmediateOptionHigh,
        lowRegisterOption2
      ])
    ).toThrow(InstructionError)
  })
  test('LdrhRegisterOffsetInstruction', () => {
    // LDRH R1, [R2, R3]
    expect(
      instructionLoadInstructionRegisterOffsetHalfword
        .encodeInstruction([
          lowRegisterOption,
          lowRegisterOption2,
          lowRegisterOption3
        ])[0]
        .toBinaryString()
    ).toEqual('0101101011010001')
    // LDRH R1, [R2, #0x1F]
    expect(() =>
      instructionLoadInstructionRegisterOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        validImmediateOptionHigh
      ])
    ).toThrow(InstructionError)
    // LDRH R1, [R2, SP]
    expect(() =>
      instructionLoadInstructionRegisterOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        highRegisterOption
      ])
    ).toThrow(InstructionError)
    // LDRH R1, [R2, R22]
    expect(() =>
      instructionLoadInstructionRegisterOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        invalidRegisterOption
      ])
    ).toThrow(InstructionError)
    // LDRH R5, [R2
    expect(() =>
      instructionLoadInstructionRegisterOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2
      ])
    ).toThrow(InstructionError)
    // LDRH R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionRegisterOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        validImmediateOptionHigh,
        lowRegisterOption2
      ])
    ).toThrow(InstructionError)
  })
})

describe('test executeInstruction function', () => {
  test('LDRH immediate offset', () => {
    // LDRH R7, [R6, #0x01]
    memory.writeWord(
      registerValueR6.add(0x01),
      Word.fromUnsignedInteger(0x0009)
    )
    instructionLoadInstructionImmediateOffsetHalfword.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1000100001110111)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
  test('LDRH register offset', () => {
    // LDRB R7, [R6, R5]
    memory.writeWord(
      registerValueR6.add(registerValueR5),
      Word.fromUnsignedInteger(0x0009)
    )
    instructionLoadInstructionRegisterOffsetHalfword.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101101101110111)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
})
