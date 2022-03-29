import { Halfword, Word } from 'types/binary'
import {
  MovInstruction,
  MovsFromLiteralInstruction,
  MovsFromRegisterInstruction
} from 'instruction/instructions/mov'
import { ILabelOffsets } from 'instruction/interfaces'
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito'
import { VirtualBoardError } from 'types/error'
import { Register, Registers } from 'board/registers'
import { Memory } from 'board/memory'
import { $enum } from 'ts-enum-util'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'
const invalidInstructionOptions = ['R77', '#2#']

const movName = 'MOV'
const movsName = 'MOVS'
const movOptions = ['R8', 'R9']
const movsOptions = ['R2', 'R7']
const movsLiteralOptions = ['R0', '#0xe6']

const lowRegisterOption: string = 'R5'
const lowRegisterValue: Word = Word.fromUnsignedInteger(0x5555)
const lowRegisterOption2: string = 'R2'
const lowRegisterValue2: Word = Word.fromUnsignedInteger(0x2222)
const highRegisterOption: string = 'SP'
const highRegisterValue: Word = Word.fromUnsignedInteger(0x13131313)
const invalidRegisterOption: string = 'R22'
const validImmediateOption: string = '#0x5C'
const invalidImmediateOption: string = '5'
const toolongImmediateOption: string = '#0x111'

const instructionMov = new MovInstruction()
const instructionMovsLiteral = new MovsFromLiteralInstruction()
const instructionMovsRegisters = new MovsFromRegisterInstruction()

const labelOffsetMock: ILabelOffsets = mock<ILabelOffsets>()
const memoryMock: Memory = mock<Memory>()
const registerMock: Registers = mock<Registers>()
const registers: Registers = instance(registerMock)
when(
  registerMock.readRegister($enum(Register).getValueOrThrow(lowRegisterOption))
).thenReturn(lowRegisterValue)
when(
  registerMock.readRegister($enum(Register).getValueOrThrow(lowRegisterOption2))
).thenReturn(lowRegisterValue2)
when(
  registerMock.readRegister($enum(Register).getValueOrThrow(highRegisterOption))
).thenReturn(highRegisterValue)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('MOV encoder', () => {
    expect(
      instructionMov.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(instructionMov.canEncodeInstruction(movsName, movsOptions)).toBe(
      false
    )
    expect(instructionMov.canEncodeInstruction(movName, movOptions)).toBe(true)
  })
  test('MOVS literal encoder', () => {
    expect(
      instructionMovsLiteral.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionMovsLiteral.canEncodeInstruction(movsName, movsOptions)
    ).toBe(false)
    expect(
      instructionMovsLiteral.canEncodeInstruction(movsName, movsLiteralOptions)
    ).toBe(true)
  })
  test('MOVS register encoder', () => {
    expect(
      instructionMovsRegisters.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionMovsRegisters.canEncodeInstruction(
        movsName,
        movsLiteralOptions
      )
    ).toBe(false)
    expect(
      instructionMovsRegisters.canEncodeInstruction(movsName, movsOptions)
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('MOV handler', () => {
    // MOV SP, R5
    expect(
      instructionMov
        .encodeInstruction(
          [highRegisterOption, lowRegisterOption],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0100011010101101')
    // MOV R5, SP
    expect(
      instructionMov
        .encodeInstruction(
          [lowRegisterOption, highRegisterOption],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0100011001101101')
    // MOV R5, R22
    expect(() =>
      instructionMov.encodeInstruction(
        [lowRegisterOption, invalidRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // MOV R5, #0x5C
    expect(() =>
      instructionMov.encodeInstruction(
        [lowRegisterOption, validImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // MOV R2, 5
    expect(() =>
      instructionMov.encodeInstruction(
        [lowRegisterOption2, invalidImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // MOV R2
    expect(() =>
      instructionMov.encodeInstruction([lowRegisterOption2], labelOffsetMock)
    ).toThrow(VirtualBoardError)
  })

  test('MOVS handler', () => {
    // MOVS with register
    // MOVS R5, R2
    expect(
      instructionMovsRegisters
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0000000000010101')
    // MOVS R2, R5
    expect(
      instructionMovsRegisters
        .encodeInstruction(
          [lowRegisterOption2, lowRegisterOption],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0000000000101010')
    // MOVS SP, R5
    expect(() =>
      instructionMovsRegisters.encodeInstruction(
        [highRegisterOption, lowRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // MOVS R5, SP
    expect(() =>
      instructionMovsRegisters.encodeInstruction(
        [lowRegisterOption, highRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // MOVS R5, R22
    expect(() =>
      instructionMovsRegisters.encodeInstruction(
        [lowRegisterOption, invalidRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)

    // MOVS with literal
    // MOVS R5, #0x5C
    expect(
      instructionMovsLiteral
        .encodeInstruction(
          [lowRegisterOption, validImmediateOption],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0010010101011100')
    // MOVS R2, 5
    expect(() =>
      instructionMovsLiteral.encodeInstruction(
        [lowRegisterOption2, invalidImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // MOVS R2, #0x111
    expect(() =>
      instructionMovsLiteral.encodeInstruction(
        [lowRegisterOption2, toolongImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
})

describe('test executeInstruction function', () => {
  test('MOV handler', () => {
    // MOV SP, R5
    instructionMov.executeInstruction(
      Halfword.fromUnsignedInteger(0b0100011010101101),
      registers,
      memoryMock
    )
    verify(
      registerMock.readRegister(
        $enum(Register).getValueOrThrow(lowRegisterOption)
      )
    ).calledBefore(
      registerMock.writeRegister(
        $enum(Register).getValueOrThrow(highRegisterOption),
        lowRegisterValue
      )
    )
    verify(
      registerMock.writeRegister(
        $enum(Register).getValueOrThrow(highRegisterOption),
        lowRegisterValue
      )
    ).once()

    resetCalls(registerMock)

    // MOV R5, SP
    instructionMov.executeInstruction(
      Halfword.fromUnsignedInteger(0b0100011001101101),
      registers,
      memoryMock
    )
    verify(
      registerMock.readRegister(
        $enum(Register).getValueOrThrow(highRegisterOption)
      )
    ).calledBefore(
      registerMock.writeRegister(
        $enum(Register).getValueOrThrow(lowRegisterOption),
        highRegisterValue
      )
    )
    verify(
      registerMock.writeRegister(
        $enum(Register).getValueOrThrow(lowRegisterOption),
        highRegisterValue
      )
    ).once()

    resetCalls(registerMock)
  })
  test('MOVS handler', () => {
    // MOVS R5, R2
    instructionMovsRegisters.executeInstruction(
      Halfword.fromUnsignedInteger(0b0000000000010101),
      registers,
      memoryMock
    )
    verify(
      registerMock.readRegister(
        $enum(Register).getValueOrThrow(lowRegisterOption2)
      )
    ).calledBefore(
      registerMock.writeRegister(
        $enum(Register).getValueOrThrow(lowRegisterOption),
        lowRegisterValue2
      )
    )
    verify(
      registerMock.writeRegister(
        $enum(Register).getValueOrThrow(lowRegisterOption),
        lowRegisterValue2
      )
    ).once()
    verify(registerMock.setNegativeFlag(anything())).called()
    verify(registerMock.setZeroFlag(lowRegisterValue2.value)).called()

    resetCalls(registerMock)

    // MOVS R2, R5
    instructionMovsRegisters.executeInstruction(
      Halfword.fromUnsignedInteger(0b0000000000101010),
      registers,
      memoryMock
    )
    verify(
      registerMock.readRegister(
        $enum(Register).getValueOrThrow(lowRegisterOption)
      )
    ).calledBefore(
      registerMock.writeRegister(
        $enum(Register).getValueOrThrow(lowRegisterOption2),
        lowRegisterValue
      )
    )
    verify(
      registerMock.writeRegister(
        $enum(Register).getValueOrThrow(lowRegisterOption2),
        lowRegisterValue
      )
    ).once()
    verify(registerMock.setNegativeFlag(anything())).called()
    verify(registerMock.setZeroFlag(lowRegisterValue.value)).called()

    resetCalls(registerMock)

    // MOVS R5, #0x5C
    instructionMovsLiteral.executeInstruction(
      Halfword.fromUnsignedInteger(0b0010010101011100),
      registers,
      memoryMock
    )
    verify(
      registerMock.writeRegister(
        $enum(Register).getValueOrThrow(lowRegisterOption),
        anything()
      )
    ).once()
    verify(registerMock.setNegativeFlag(anything())).called()
    verify(
      registerMock.setZeroFlag(parseInt(validImmediateOption.slice(1), 16))
    ).called()
  })
})
