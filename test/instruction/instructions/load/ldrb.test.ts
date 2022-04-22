import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import {
  LdrbImmediate5OffsetInstruction,
  LdrbRegisterOffsetInstruction
} from 'instruction/instructions/load/ldrb'
import { ILabelOffsets } from 'instruction/interfaces'
import { mock } from 'ts-mockito'
import { Halfword, Word } from 'types/binary'
import { VirtualBoardError } from 'types/error'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'

const invalidInstructionOptions = ['R77', '#2#']

const ldrName = 'LDR'
const ldrbName = 'LDRB'
const ldrhName = 'LDRH'

const ldrRegisterOptionsValid = ['R0', '[R1', 'R2]']
const ldrRegisterOptionsInvalid = ['R0', 'R1', 'R2']
const ldrRegisterOptionsInvalid2 = ['R0', 'R1]', '[R2']
const ldrLiteralOptionsValid = ['R0', '[R1', '#0xe6]']
const ldrLiteralOptionsInvalid = ['R0', 'R1', '#0xe6']
const ldrLiteralOptionsInvalid2 = ['R0', 'R1]', '[#0xe6']

const lowRegisterOption: string = 'R1'
const lowRegisterOption2: string = '[R2'
const lowRegisterOption3: string = 'R3]'
const validImmediateOptionLow: string = '#0x01]'
const validImmediateOptionHigh: string = '#0x1F'
const invalidImmediateOption: string = '5'

const highRegisterOption: string = 'SP'
const invalidRegisterOption: string = 'R22'

const instructionLoadInstructionImmediateOffsetByte =
  new LdrbImmediate5OffsetInstruction()
const instructionLoadInstructionRegisterOffsetByte =
  new LdrbRegisterOffsetInstruction()

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
  test('LOAD instruction - LDRB (immediate offset) - byte encoder', () => {
    expect(
      instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(
        ldrName,
        ldrLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(
        ldrhName,
        ldrLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(
        ldrbName,
        ldrRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(
        ldrhName,
        ldrRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(
        ldrhName,
        ldrRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(
        ldrbName,
        ldrLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(
        ldrbName,
        ldrLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffsetByte.canEncodeInstruction(
        ldrbName,
        ldrLiteralOptionsValid
      )
    ).toBe(true)
  })
  test('LOAD instruction - LDRB (register offset) - byte encoder', () => {
    expect(
      instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(
        ldrName,
        ldrRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(
        ldrhName,
        ldrRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(
        ldrbName,
        ldrLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(
        ldrbName,
        ldrRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(
        ldrbName,
        ldrRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(
        ldrbName,
        ldrLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffsetByte.canEncodeInstruction(
        ldrbName,
        ldrRegisterOptionsValid
      )
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('LdrbImmediate5OffsetInstruction', () => {
    // LDRB R1, [R2, #0x01]
    expect(
      instructionLoadInstructionImmediateOffsetByte
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, validImmediateOptionLow],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0111100001010001')
    // LDRB R1, [R2, #0x1F]
    expect(
      instructionLoadInstructionImmediateOffsetByte
        .encodeInstruction(
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
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
  test('LdrbRegisterOffsetInstruction', () => {
    // LDRB R1, [R2, R3]
    expect(
      instructionLoadInstructionRegisterOffsetByte
        .encodeInstruction(
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
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
})

describe('test executeInstruction function', () => {
  test('LDRB immediate offset', () => {
    // LDRB R7, [R6, #0x01]
    memory.writeWord(
      registerValueR6.add(0x01),
      Word.fromUnsignedInteger(0x0009)
    )
    instructionLoadInstructionImmediateOffsetByte.executeInstruction(
      Halfword.fromUnsignedInteger(0b0111100001110111),
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
  test('LDRB register offset', () => {
    // LDRB R7, [R6, R5]
    memory.writeWord(
      registerValueR6.add(registerValueR5),
      Word.fromUnsignedInteger(0x0009)
    )
    instructionLoadInstructionRegisterOffsetByte.executeInstruction(
      Halfword.fromUnsignedInteger(0b0101110101110111),
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
})
