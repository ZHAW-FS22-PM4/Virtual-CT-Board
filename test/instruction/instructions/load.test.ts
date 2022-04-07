import { Halfword, Word } from 'types/binary'
import {
  LoadInstructionImmediateOffset,
  LoadInstructionImmediateOffsetByte,
  LoadInstructionImmediateOffsetHalfword,
  LoadInstructionPointerOffset,
  LoadInstructionRegisterOffset,
  LoadInstructionRegisterOffsetByte,
  LoadInstructionRegisterOffsetHalfword
} from 'instruction/instructions/load'
import { ILabelOffsets } from 'instruction/interfaces'
import { mock } from 'ts-mockito'
import { VirtualBoardError } from 'types/error'
import { Register, Registers } from 'board/registers'
import { Memory } from 'board/memory'

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
const strPCOptionsValid = ['R0', '[PC', '#0xe6]']


const lowRegisterOption: string = 'R1'
const lowRegisterOption2: string = '[R2'
const lowRegisterOption3: string = 'R3]'
const validImmediateOptionLow: string = '#0x01]'
const validImmediateOptionHigh: string = '#0x1F'
const invalidImmediateOption: string = '5'

const highRegisterOption: string = 'SP'
const invalidRegisterOption: string = 'R22'

const instructionLoadInstructionImmediateOffset = new LoadInstructionImmediateOffset()
const instructionLoadInstructionRegisterOffset = new LoadInstructionRegisterOffset()
const instructionLoadInstructionImmediateOffsetHalfword = new LoadInstructionImmediateOffsetHalfword()
const instructionLoadInstructionRegisterOffsetHalfword = new LoadInstructionRegisterOffsetHalfword()
const instructionLoadInstructionImmediateOffsetByte = new LoadInstructionImmediateOffsetByte()
const instructionLoadInstructionRegisterOffsetByte = new LoadInstructionRegisterOffsetByte()
const instructionLoadInstructionPointerOffset = new LoadInstructionPointerOffset()

const labelOffsetMock: ILabelOffsets = mock<ILabelOffsets>()
const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR7: Word = Word.fromUnsignedInteger(0x00000000)
const registerValueR6: Word = Word.fromUnsignedInteger(0x12345678)
const registerValueR5: Word = Word.fromUnsignedInteger(0x00000100)

registers.writeRegister(Register.R7, registerValueR7)
registers.writeRegister(Register.R6, registerValueR6)
registers.writeRegister(Register.R5, registerValueR5)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('LOAD instruction - LDR (immediate offset) - word encoder', () => {
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(instructionLoadInstructionImmediateOffset.canEncodeInstruction(strbName, strLiteralOptionsValid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffset.canEncodeInstruction(strhName, strLiteralOptionsValid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffset.canEncodeInstruction(strName, strRegisterOptionsValid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffset.canEncodeInstruction(strName, strRegisterOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffset.canEncodeInstruction(strName, strRegisterOptionsInvalid2)).toBe(false)
    expect(instructionLoadInstructionImmediateOffset.canEncodeInstruction(strName, strLiteralOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffset.canEncodeInstruction(strName, strLiteralOptionsInvalid2)).toBe(false)
    expect(instructionLoadInstructionImmediateOffset.canEncodeInstruction(strName, strLiteralOptionsValid)).toBe(true)
  })
  test('LOAD instruction - LDR (register offset) - word encoder', () => {
    expect(
        instructionLoadInstructionRegisterOffset.canEncodeInstruction(
            invalidInstructionName,
            invalidInstructionOptions
        )
    ).toBe(false)
    expect(instructionLoadInstructionRegisterOffset.canEncodeInstruction(strbName, strRegisterOptionsValid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffset.canEncodeInstruction(strhName, strRegisterOptionsValid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffset.canEncodeInstruction(strName, strLiteralOptionsValid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffset.canEncodeInstruction(strName, strRegisterOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffset.canEncodeInstruction(strName, strRegisterOptionsInvalid2)).toBe(false)
    expect(instructionLoadInstructionRegisterOffset.canEncodeInstruction(strName, strLiteralOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffset.canEncodeInstruction(strName, strLiteralOptionsInvalid2)).toBe(false)
    expect(instructionLoadInstructionRegisterOffset.canEncodeInstruction(strName, strRegisterOptionsValid)).toBe(true)
  })
  test('LOAD instruction - LDR (immediate offset) - halfword encoder', () => {
    expect(
        instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(
            invalidInstructionName,
            invalidInstructionOptions
        )
    ).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(strbName, strLiteralOptionsValid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(strName, strLiteralOptionsValid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(strhName, strRegisterOptionsValid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(strhName, strRegisterOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(strhName, strRegisterOptionsInvalid2)).toBe(false)
        expect(instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(strhName, strLiteralOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(strhName, strLiteralOptionsInvalid2)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetHalfword.canEncodeInstruction(strhName, strLiteralOptionsValid)).toBe(true)
  })
  test('LOAD instruction - LDR (register offset) - halfword encoder', () => {
    expect(
        instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(
            invalidInstructionName,
            invalidInstructionOptions
        )
    ).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(strbName, strRegisterOptionsValid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(strName, strRegisterOptionsValid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(strhName, strLiteralOptionsValid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(strhName, strRegisterOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(strhName, strRegisterOptionsInvalid2)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(strhName, strLiteralOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(strhName, strLiteralOptionsInvalid2)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetHalfword.canEncodeInstruction(strhName, strRegisterOptionsValid)).toBe(true)
  })
  test('LOAD instruction - LDR (immediate offset) - byte encoder', () => {
    expect(
        instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(
            invalidInstructionName,
            invalidInstructionOptions
        )
    ).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(strName, strLiteralOptionsValid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(strhName, strLiteralOptionsValid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(strbName, strRegisterOptionsValid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(strhName, strRegisterOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(strhName, strRegisterOptionsInvalid2)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(strbName, strLiteralOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(strbName, strLiteralOptionsInvalid2)).toBe(false)
    expect(instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(strbName, strLiteralOptionsValid)).toBe(true)
  })
  test('LOAD instruction - LDR (register offset) - byte encoder', () => {
    expect(
        instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(
            invalidInstructionName,
            invalidInstructionOptions
        )
    ).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(strName, strRegisterOptionsValid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(strhName, strRegisterOptionsValid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(strbName, strLiteralOptionsValid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(strbName, strRegisterOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(strbName, strRegisterOptionsInvalid2)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(strbName, strLiteralOptionsInvalid)).toBe(false)
    expect(instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(strbName, strRegisterOptionsValid)).toBe(true)

})
  test('LOAD instruction - LDR (pointer + offset) - word', () => {
  expect(
    instructionLoadInstructionPointerOffset.canEncodeInstruction(
      invalidInstructionName,
      invalidInstructionOptions
    )
  ).toBe(false)
  expect(instructionLoadInstructionPointerOffset.canEncodeInstruction(strName, strRegisterOptionsValid)).toBe(false)
  expect(instructionLoadInstructionPointerOffset.canEncodeInstruction(strName, strPCOptionsValid)).toBe(true)
  expect(instructionLoadInstructionPointerOffset.canEncodeInstruction(strhName, strRegisterOptionsValid)).toBe(false)
  expect(instructionLoadInstructionPointerOffset.canEncodeInstruction(strbName, strLiteralOptionsValid)).toBe(false)
  expect(instructionLoadInstructionPointerOffset.canEncodeInstruction(strbName, strRegisterOptionsInvalid)).toBe(false)
  expect(instructionLoadInstructionPointerOffset.canEncodeInstruction(strbName, strRegisterOptionsInvalid2)).toBe(false)
  expect(instructionLoadInstructionPointerOffset.canEncodeInstruction(strbName, strLiteralOptionsInvalid)).toBe(false)
  expect(instructionLoadInstructionPointerOffset.canEncodeInstruction(strbName, strPCOptionsValid)).toBe(false)
})
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('LoadInstructionImmediateOffset', () => {
    // LDR R1, [R2, #0x01]
    expect(
      instructionLoadInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionLow],
        labelOffsetMock
      )
        .toBinaryString()
    ).toEqual('0110100001010001')
    // LDR R1, [R2, #0x1F]
    expect(
      instructionLoadInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
        labelOffsetMock
      )
        .toBinaryString()
    ).toEqual('0110111111010001')
    // LDR R1, [R2, R3]
    expect(() =>
      instructionLoadInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R5, [R2
    expect(() =>
      instructionLoadInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R1, [R2, 5]
    expect(() =>
      instructionLoadInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock)
    ).toThrow(VirtualBoardError)
  })
  test('LoadInstructionImmediateOffsetHalfword', () => {
    // LDRH R1, [R2, #0x01]
    expect(
      instructionLoadInstructionImmediateOffsetHalfword.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionLow],
        labelOffsetMock
      )
        .toBinaryString()
    ).toEqual('1000100001010001')
    // LDRH R1, [R2, #0x1F]
    expect(
      instructionLoadInstructionImmediateOffsetHalfword.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
        labelOffsetMock
      )
        .toBinaryString()
    ).toEqual('1000111111010001')
    // LDRH R1, [R2, R3]
    expect(() =>
      instructionLoadInstructionImmediateOffsetHalfword.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRH R5, [R2
    expect(() =>
      instructionLoadInstructionImmediateOffsetHalfword.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRH R1, [R2, 5]
    expect(() =>
      instructionLoadInstructionImmediateOffsetHalfword.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRH R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionImmediateOffsetHalfword.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock)
    ).toThrow(VirtualBoardError)
  })
  test('LoadInstructionImmediateOffsetByte', () => {
    // LDRB R1, [R2, #0x01]
    expect(
      instructionLoadInstructionImmediateOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionLow],
        labelOffsetMock
      )
        .toBinaryString()
    ).toEqual('0111100001010001')
    // LDRB R1, [R2, #0x1F]
    expect(
      instructionLoadInstructionImmediateOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
        labelOffsetMock
      )
        .toBinaryString()
    ).toEqual('0111111111010001')
    // LDRB R1, [R2, R3]
    expect(() =>
      instructionLoadInstructionImmediateOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRB R5, [R2
    expect(() =>
      instructionLoadInstructionImmediateOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRB R1, [R2, 5]
    expect(() =>
      instructionLoadInstructionImmediateOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRB R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionImmediateOffsetByte.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock)
    ).toThrow(VirtualBoardError)
  })
  test('LoadInstructionRegisterOffset', () => {
    // LDR R1, [R2, R3]
    expect(
      instructionLoadInstructionRegisterOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
        labelOffsetMock
      )
        .toBinaryString()
    ).toEqual('0101100011010001')
    // LDR R1, [R2, #0x1F]
    expect(() =>
      instructionLoadInstructionRegisterOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R1, [R2, SP]
    expect(() =>
      instructionLoadInstructionRegisterOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, highRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R1, [R2, R22]
    expect(() =>
      instructionLoadInstructionRegisterOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R5, [R2
    expect(() =>
      instructionLoadInstructionRegisterOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionRegisterOffset.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock)
    ).toThrow(VirtualBoardError)
  })
  test('LoadInstructionRegisterOffsetHalfword', () => {
    // LDRH R1, [R2, R3]
    expect(
      instructionLoadInstructionRegisterOffsetHalfword.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
        labelOffsetMock
      )
        .toBinaryString()
    ).toEqual('0101101011010001')
    // LDRH R1, [R2, #0x1F]
    expect(() =>
      instructionLoadInstructionRegisterOffsetHalfword.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRH R1, [R2, SP]
    expect(() =>
      instructionLoadInstructionRegisterOffsetHalfword.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, highRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRH R1, [R2, R22]
    expect(() =>
      instructionLoadInstructionRegisterOffsetHalfword.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRH R5, [R2
    expect(() =>
      instructionLoadInstructionRegisterOffsetHalfword.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRH R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionRegisterOffsetHalfword.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock)
    ).toThrow(VirtualBoardError)
  })
  test('LoadInstructionRegisterOffsetByte', () => {
    // LDRB R1, [R2, R3]
    expect(
      instructionLoadInstructionRegisterOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
        labelOffsetMock
      )
        .toBinaryString()
    ).toEqual('0101110011010001')
    // LDRB R1, [R2, #0x1F]
    expect(() =>
      instructionLoadInstructionRegisterOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRB R1, [R2, SP]
    expect(() =>
      instructionLoadInstructionRegisterOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, highRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRB R1, [R2, R22]
    expect(() =>
      instructionLoadInstructionRegisterOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRB R5, [R2
    expect(() =>
      instructionLoadInstructionRegisterOffsetByte.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDRB R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionRegisterOffsetByte.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock)
    ).toThrow(VirtualBoardError)
  })
  test('LoadInstructionPointerOffset', () => {
    // LDR R1, [SP, #0x01]
    expect(
      instructionLoadInstructionPointerOffset.encodeInstruction(
        [lowRegisterOption, highRegisterOption, validImmediateOptionLow],
        labelOffsetMock
      )
        .toBinaryString()
    ).toEqual('0100100100000001')
    // LDR R1, [SP, #0x1F]
    expect(
      instructionLoadInstructionPointerOffset.encodeInstruction(
        [lowRegisterOption, highRegisterOption, validImmediateOptionHigh],
        labelOffsetMock
      )
        .toBinaryString()
    ).toEqual('0100100100011111')
    // LDR R1, [R2, R3]
    expect(() =>
      instructionLoadInstructionPointerOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R5, [R2
    expect(() =>
      instructionLoadInstructionPointerOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R1, [R2, 5]
    expect(() =>
      instructionLoadInstructionPointerOffset.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionPointerOffset.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock)
    ).toThrow(VirtualBoardError)
  })
})


describe('test executeInstruction function', () => {
  test('LDR word immediate offset', () => {
    // LDR R7, [R6, #0x01]

    memory.writeWord(registerValueR6.add(0x01), Word.fromUnsignedInteger(0x0009))
    instructionLoadInstructionImmediateOffset.executeInstruction(
      Halfword.fromUnsignedInteger(0b0110100001110111),
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })

  test('LDR word register offset', () => {
    // LDR R7, [R6, R5]
    memory.writeWord(registerValueR6.add(registerValueR5), Word.fromUnsignedInteger(0x0009))
    instructionLoadInstructionRegisterOffset.executeInstruction(
      Halfword.fromUnsignedInteger(0b0101100101110111),
      registers,
      memory
    )
    //expect(memory.readWord(registerValueR6.add(registerValueR5)).value).toEqual(9)
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })

  test('LDRH halfword immediate offset', () => {
    // LDRH R7, [R6, #0x01]
    memory.writeWord(registerValueR6.add(0x01), Word.fromUnsignedInteger(0x0009))
    instructionLoadInstructionImmediateOffsetHalfword.executeInstruction(
      Halfword.fromUnsignedInteger(0b1000100001110111),
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })

  test('LDR halfword register offset', () => {
    // LDRB R7, [R6, R5]
    memory.writeWord(registerValueR6.add(registerValueR5), Word.fromUnsignedInteger(0x0009))
    instructionLoadInstructionRegisterOffsetHalfword.executeInstruction(
      Halfword.fromUnsignedInteger(0b0101101101110111),
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })

  test('LDR byte immediate offset', () => {
    // LDRB R7, [R6, #0x01]
    memory.writeWord(registerValueR6.add(0x01), Word.fromUnsignedInteger(0x0009))
    instructionLoadInstructionImmediateOffsetHalfword.executeInstruction(
      Halfword.fromUnsignedInteger(0b0111100001110111),
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })

  test('LDR byte register offset', () => {
    // LDRB R7, [R6, R5]
    memory.writeWord(registerValueR6.add(registerValueR5), Word.fromUnsignedInteger(0x0009))
    instructionLoadInstructionRegisterOffsetHalfword.executeInstruction(
      Halfword.fromUnsignedInteger(0b0101110101110111),
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
})