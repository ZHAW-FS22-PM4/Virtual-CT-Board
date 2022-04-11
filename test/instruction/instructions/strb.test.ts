import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import {
  StrbImmediate5OffsetInstruction,
  StrbRegisterOffsetInstruction
} from 'instruction/instructions/strb'
import { StrhRegisterOffsetInstruction } from 'instruction/instructions/strh'
import { ILabelOffsets } from 'instruction/interfaces'
import { mock } from 'ts-mockito'
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

const instructionStoreInstructionRegisterOffsetHalfword =
  new StrhRegisterOffsetInstruction()
const instructionStoreInstructionImmediateOffsetByte =
  new StrbImmediate5OffsetInstruction()
const instructionStoreInstructionRegisterOffsetByte =
  new StrbRegisterOffsetInstruction()

const labelOffsetMock: ILabelOffsets = mock<ILabelOffsets>()
const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR7: Word = Word.fromUnsignedInteger(0x08000010)
const registerValueR6: Word = Word.fromUnsignedInteger(0x12345678)
const registerValueR5: Word = Word.fromUnsignedInteger(0x00000100)

registers.writeRegister(Register.R7, registerValueR7)
registers.writeRegister(Register.R6, registerValueR6)
registers.writeRegister(Register.R5, registerValueR5)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('STORE instruction - STRB (immediate offset) - byte encoder', () => {
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strhName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strbName,
        strRegisterOptionsValid
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
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strbName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strbName,
        strLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strbName,
        strLiteralOptionsValid
      )
    ).toBe(true)
  })
  test('STORE instruction - STRB (register offset) - byte encoder', () => {
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strbName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strbName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strbName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strbName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strbName,
        strRegisterOptionsValid
      )
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('StrbImmediate5OffsetInstruction', () => {
    // STR R1, [R2, #0x01]
    expect(
      instructionStoreInstructionImmediateOffsetByte
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, validImmediateOptionLow],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0111000001010001')
    // STR R1, [R2, #0x1F]
    expect(
      instructionStoreInstructionImmediateOffsetByte
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0111011111010001')
    // STR R1, [R2, R3]
    expect(() =>
      instructionStoreInstructionImmediateOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionImmediateOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R1, [R2, 5]
    expect(() =>
      instructionStoreInstructionImmediateOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionImmediateOffsetByte.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
  test('StrbRegisterOffsetInstruction', () => {
    // STR R1, [R2, R3]
    expect(
      instructionStoreInstructionRegisterOffsetByte
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0101010011010001')
    // STR R1, [R2, #0x1F]
    expect(() =>
      instructionStoreInstructionRegisterOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R1, [R2, SP]
    expect(() =>
      instructionStoreInstructionRegisterOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, highRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R1, [R2, R22]
    expect(() =>
      instructionStoreInstructionRegisterOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionRegisterOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionRegisterOffsetByte.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
})

describe('test executeInstruction function', () => {
  test('STRB immediate offset', () => {
    // STR R7, [R6, #0x01]
    instructionStoreInstructionImmediateOffsetByte.executeInstruction(
      Halfword.fromUnsignedInteger(0b0111000001111110),
      registers,
      memory
    )
    expect(memory.readWord(registerValueR7.add(0x01)).toHexString()).toEqual(
      '00000078'
    )
    memory.reset()
  })
  test('STRB register offset', () => {
    // STR R7, [R6, R5]
    instructionStoreInstructionRegisterOffsetByte.executeInstruction(
      Halfword.fromUnsignedInteger(0b0101010101111110),
      registers,
      memory
    )
    expect(
      memory.readWord(registerValueR7.add(registerValueR5)).toHexString()
    ).toEqual('00000078')
    memory.reset()
  })
})
