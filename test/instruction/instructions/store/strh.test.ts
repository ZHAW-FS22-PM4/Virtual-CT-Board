import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import {
  StrhImmediate5OffsetInstruction,
  StrhRegisterOffsetInstruction
} from 'instruction/instructions/store/strh'
import { Halfword, Word } from 'types/binary'
import { VirtualBoardError } from 'types/error'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'

const invalidInstructionOptions = ['R77', '#2#']

const strName = 'STR'
const strbName = 'STRB'
const strhName = 'STRH'

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

const instructionStoreInstructionImmediateOffsetHalfword =
  new StrhImmediate5OffsetInstruction()
const instructionStoreInstructionRegisterOffsetHalfword =
  new StrhRegisterOffsetInstruction()

const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR7: Word = Word.fromUnsignedInteger(0x08000010)
const registerValueR6: Word = Word.fromUnsignedInteger(0x12345678)
const registerValueR5: Word = Word.fromUnsignedInteger(0x00000100)

registers.writeRegister(Register.R7, registerValueR7)
registers.writeRegister(Register.R6, registerValueR6)
registers.writeRegister(Register.R5, registerValueR5)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('STORE instruction - STRH (immediate offset) - halfword encoder', () => {
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strbName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsValid
      )
    ).toBe(true)
  })
  test('STORE instruction - STRH (register offset) - halfword encoder', () => {
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strbName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('StrhImmediate5OffsetInstruction', () => {
    // STR R1, [R2, #0x01]
    expect(
      instructionStoreInstructionImmediateOffsetHalfword
        .encodeInstruction([
          lowRegisterOption,
          lowRegisterOption2,
          validImmediateOptionLow
        ])[0]
        .toBinaryString()
    ).toEqual('1000000001010001')
    // STR R1, [R2, #0x1F]
    expect(
      instructionStoreInstructionImmediateOffsetHalfword
        .encodeInstruction([
          lowRegisterOption,
          lowRegisterOption2,
          validImmediateOptionHigh
        ])[0]
        .toBinaryString()
    ).toEqual('1000011111010001')
    // STR R1, [R2, R3]
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        lowRegisterOption3
      ])
    ).toThrow(VirtualBoardError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
    // STR R1, [R2, 5]
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        invalidImmediateOption
      ])
    ).toThrow(VirtualBoardError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        validImmediateOptionHigh,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
  })
  test('StrhRegisterOffsetInstruction', () => {
    // STR R1, [R2, R3]
    expect(
      instructionStoreInstructionRegisterOffsetHalfword
        .encodeInstruction([
          lowRegisterOption,
          lowRegisterOption2,
          lowRegisterOption3
        ])[0]
        .toBinaryString()
    ).toEqual('0101001011010001')
    // STR R1, [R2, #0x1F]
    expect(() =>
      instructionStoreInstructionRegisterOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        validImmediateOptionHigh
      ])
    ).toThrow(VirtualBoardError)
    // STR R1, [R2, SP]
    expect(() =>
      instructionStoreInstructionRegisterOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        highRegisterOption
      ])
    ).toThrow(VirtualBoardError)
    // STR R1, [R2, R22]
    expect(() =>
      instructionStoreInstructionRegisterOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        invalidRegisterOption
      ])
    ).toThrow(VirtualBoardError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionRegisterOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionRegisterOffsetHalfword.encodeInstruction([
        lowRegisterOption,
        validImmediateOptionHigh,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
  })
})

describe('test executeInstruction function', () => {
  test('STRH immediate offset', () => {
    // STR R7, [R6, #0x01]
    instructionStoreInstructionImmediateOffsetHalfword.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1000000001111110)],
      registers,
      memory
    )
    expect(memory.readWord(registerValueR7.add(0x01)).toHexString()).toEqual(
      '00005678'
    )
    memory.reset()
  })
  test('STRH register offset', () => {
    // STR R7, [R6, R5]
    instructionStoreInstructionRegisterOffsetHalfword.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101000101111110)],
      registers,
      memory
    )
    expect(
      memory.readWord(registerValueR7.add(registerValueR5)).toHexString()
    ).toEqual('00005678')
    memory.reset()
  })
})
