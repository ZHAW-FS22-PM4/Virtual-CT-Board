import { Halfword, Word } from 'types/binary'
import { ILabelOffsets } from 'instruction/interfaces'
import { mock } from 'ts-mockito'
import { VirtualBoardError } from 'types/error'
import { Register, Registers } from 'board/registers'
import { Memory } from 'board/memory'
import {
  StrImmediate5OffsetInstruction,
  StrRegisterOffsetInstruction
} from 'instruction/instructions/str'

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

const instructionStoreInstructionImmediateOffset =
  new StrImmediate5OffsetInstruction()
const instructionStoreInstructionRegisterOffset =
  new StrRegisterOffsetInstruction()

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
  test('STORE instruction - STR (immediate offset) - word encoder', () => {
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strbName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strhName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsValid
      )
    ).toBe(true)
  })
  test('STORE instruction - STR (register offset) - word encoder', () => {
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strbName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('StrImmediate5OffsetInstruction', () => {
    // STR R1, [R2, #0x01]
    expect(
      instructionStoreInstructionImmediateOffset
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, validImmediateOptionLow],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0110000001010001')
    // STR R1, [R2, #0x1F]
    expect(
      instructionStoreInstructionImmediateOffset
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0110011111010001')
    // STR R1, [R2, R3]
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R1, [R2, 5]
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
  test('StrRegisterOffsetInstruction', () => {
    // STR R1, [R2, R3]
    expect(
      instructionStoreInstructionRegisterOffset
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0101000011010001')
    // STR R1, [R2, #0x1F]
    expect(() =>
      instructionStoreInstructionRegisterOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R1, [R2, SP]
    expect(() =>
      instructionStoreInstructionRegisterOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, highRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R1, [R2, R22]
    expect(() =>
      instructionStoreInstructionRegisterOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionRegisterOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionRegisterOffset.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
})

describe('test executeInstruction function', () => {
  test('STR word immediate offset', () => {
    // STR R7, [R6, #0x01]
    instructionStoreInstructionImmediateOffset.executeInstruction(
      Halfword.fromUnsignedInteger(0b0110000001111110),
      registers,
      memory
    )
    expect(memory.readWord(registerValueR7.add(0x01)).toHexString()).toEqual(
      '12345678'
    )
    memory.reset()
  })
  test('STR word register offset', () => {
    // STR R7, [R6, R5]
    instructionStoreInstructionRegisterOffset.executeInstruction(
      Halfword.fromUnsignedInteger(0b0101000101111110),
      registers,
      memory
    )
    expect(
      memory.readWord(registerValueR7.add(registerValueR5)).toHexString()
    ).toEqual('12345678')
    memory.reset()
  })
})
