import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import {
  MovsImmediate8Instruction,
  MovsRegistersInstruction
} from 'instruction/instructions/mov/movs'
import { $enum } from 'ts-enum-util'
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito'
import { Halfword, Word } from 'types/binary'
import { VirtualBoardError } from 'types/error'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'
const invalidInstructionOptions = ['R77', '#2#']

const movsName = 'MOVS'
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

const instructionMovsLiteral = new MovsImmediate8Instruction()
const instructionMovsRegisters = new MovsRegistersInstruction()

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
when(registerMock.readRegister(Register.PC)).thenReturn(
  Word.fromUnsignedInteger(0x0)
)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
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
  test('MOVS handler', () => {
    // MOVS with register
    // MOVS R5, R2
    expect(
      instructionMovsRegisters
        .encodeInstruction([lowRegisterOption, lowRegisterOption2])[0]
        .toBinaryString()
    ).toEqual('0000000000010101')
    // MOVS R2, R5
    expect(
      instructionMovsRegisters
        .encodeInstruction([lowRegisterOption2, lowRegisterOption])[0]
        .toBinaryString()
    ).toEqual('0000000000101010')
    // MOVS SP, R5
    expect(() =>
      instructionMovsRegisters.encodeInstruction([
        highRegisterOption,
        lowRegisterOption
      ])
    ).toThrow(VirtualBoardError)
    // MOVS R5, SP
    expect(() =>
      instructionMovsRegisters.encodeInstruction([
        lowRegisterOption,
        highRegisterOption
      ])
    ).toThrow(VirtualBoardError)
    // MOVS R5, R22
    expect(() =>
      instructionMovsRegisters.encodeInstruction([
        lowRegisterOption,
        invalidRegisterOption
      ])
    ).toThrow(VirtualBoardError)

    // MOVS with literal
    // MOVS R5, #0x5C
    expect(
      instructionMovsLiteral
        .encodeInstruction([lowRegisterOption, validImmediateOption])[0]
        .toBinaryString()
    ).toEqual('0010010101011100')
    // MOVS R2, 5
    expect(() =>
      instructionMovsLiteral.encodeInstruction([
        lowRegisterOption2,
        invalidImmediateOption
      ])
    ).toThrow(VirtualBoardError)
    // MOVS R2, #0x111
    expect(() =>
      instructionMovsLiteral.encodeInstruction([
        lowRegisterOption2,
        toolongImmediateOption
      ])
    ).toThrow(VirtualBoardError)
  })
})

describe('test executeInstruction function', () => {
  test('MOVS handler', () => {
    // MOVS R5, R2
    instructionMovsRegisters.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0000000000010101)],
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
    verify(registerMock.setFlags(anything())).called()

    resetCalls(registerMock)

    // MOVS R2, R5
    instructionMovsRegisters.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0000000000101010)],
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
    verify(registerMock.setFlags(anything())).called()

    resetCalls(registerMock)

    // MOVS R5, #0x5C
    instructionMovsLiteral.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0010010101011100)],
      registers,
      memoryMock
    )
    verify(
      registerMock.writeRegister(
        $enum(Register).getValueOrThrow(lowRegisterOption),
        anything()
      )
    ).once()
    verify(registerMock.setFlags(anything())).called()
  })
})
