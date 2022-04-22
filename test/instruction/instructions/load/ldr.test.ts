import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import {
  LdrImmediate5OffsetInstruction,
  LdrRegisterInstruction,
  LdrRegisterOffsetInstruction
} from 'instruction/instructions/load/ldr'
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
const ldrPCOptionsValid = ['R0', '[PC', '#0xe6]']

const lowRegisterOption: string = 'R1'
const lowRegisterOption2: string = '[R2'
const lowRegisterOption3: string = 'R3]'
const validImmediateOptionLow: string = '#0x01]'
const validImmediateOptionHigh: string = '#0x1F'
const invalidImmediateOption: string = '5'

const highRegisterOption: string = 'SP'
const invalidRegisterOption: string = 'R22'

const instructionLoadInstructionImmediateOffset =
  new LdrImmediate5OffsetInstruction()
const instructionLoadInstructionRegisterOffset =
  new LdrRegisterOffsetInstruction()
const instructionLoadInstructionPointerOffset = new LdrRegisterInstruction()

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
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        ldrbName,
        ldrLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        ldrhName,
        ldrLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        ldrName,
        ldrRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        ldrName,
        ldrRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        ldrName,
        ldrRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        ldrName,
        ldrLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        ldrName,
        ldrLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        ldrName,
        ldrLiteralOptionsValid
      )
    ).toBe(true)
  })
  test('LOAD instruction - LDR (register offset) - word encoder', () => {
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        ldrbName,
        ldrRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        ldrhName,
        ldrRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        ldrName,
        ldrLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        ldrName,
        ldrRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        ldrName,
        ldrRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        ldrName,
        ldrLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        ldrName,
        ldrLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        ldrName,
        ldrRegisterOptionsValid
      )
    ).toBe(true)
  })
  test('LOAD instruction - LDR (pointer + offset) - word', () => {
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        ldrName,
        ldrRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        ldrName,
        ldrPCOptionsValid
      )
    ).toBe(true)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        ldrhName,
        ldrRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        ldrbName,
        ldrLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        ldrbName,
        ldrRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        ldrbName,
        ldrRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        ldrbName,
        ldrLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        ldrbName,
        ldrPCOptionsValid
      )
    ).toBe(false)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('LdrImmediate5OffsetInstruction', () => {
    // LDR R1, [R2, #0x01]
    expect(
      instructionLoadInstructionImmediateOffset
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, validImmediateOptionLow],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0110100001010001')
    // LDR R1, [R2, #0x1F]
    expect(
      instructionLoadInstructionImmediateOffset
        .encodeInstruction(
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
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
  test('LdrRegisterOffsetInstruction', () => {
    // LDR R1, [R2, R3]
    expect(
      instructionLoadInstructionRegisterOffset
        .encodeInstruction(
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
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
  test('LoadRegisterInstruction', () => {
    // LDR R1, [SP, #0x01]
    expect(
      instructionLoadInstructionPointerOffset
        .encodeInstruction(
          [lowRegisterOption, highRegisterOption, validImmediateOptionLow],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0100100100000001')
    // LDR R1, [SP, #0x1F]
    expect(
      instructionLoadInstructionPointerOffset
        .encodeInstruction(
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
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
})

describe('test executeInstruction function', () => {
  test('LDR word immediate offset', () => {
    // LDR R7, [R6, #0x01]

    memory.writeWord(
      registerValueR6.add(0x01),
      Word.fromUnsignedInteger(0x0009)
    )
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
    memory.writeWord(
      registerValueR6.add(registerValueR5),
      Word.fromUnsignedInteger(0x0009)
    )
    instructionLoadInstructionRegisterOffset.executeInstruction(
      Halfword.fromUnsignedInteger(0b0101100101110111),
      registers,
      memory
    )
    //expect(memory.readWord(registerValueR6.add(registerValueR5)).value).toEqual(9)
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
})
