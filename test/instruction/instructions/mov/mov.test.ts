import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import { MovInstruction } from 'instruction/instructions/mov/mov'
import { $enum } from 'ts-enum-util'
import { instance, mock, resetCalls, verify, when } from 'ts-mockito'
import { Halfword, Word } from 'types/binary'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'
const invalidInstructionOptions = ['R77', '#2#']

const movName = 'MOV'
const movsName = 'MOVS'
const movOptions = ['R8', 'R9']
const movsOptions = ['R2', 'R7']

const lowRegisterOption: string = 'R5'
const lowRegisterValue: Word = Word.fromUnsignedInteger(0x5555)
const lowRegisterOption2: string = 'R2'
const lowRegisterValue2: Word = Word.fromUnsignedInteger(0x2222)
const highRegisterOption: string = 'SP'
const highRegisterValue: Word = Word.fromUnsignedInteger(0x13131313)
const invalidRegisterOption: string = 'R22'
const validImmediateOption: string = '#0x5C'
const invalidImmediateOption: string = '5'

const instructionMov = new MovInstruction()

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
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('MOV handler', () => {
    // MOV SP, R5
    expect(
      instructionMov
        .encodeInstruction([highRegisterOption, lowRegisterOption])[0]
        .toBinaryString()
    ).toEqual('0100011010101101')
    // MOV R5, SP
    expect(
      instructionMov
        .encodeInstruction([lowRegisterOption, highRegisterOption])[0]
        .toBinaryString()
    ).toEqual('0100011001101101')
    // MOV R5, R22
    expect(() =>
      instructionMov.encodeInstruction([
        lowRegisterOption,
        invalidRegisterOption
      ])
    ).toThrow(InstructionError)
    // MOV R5, #0x5C
    expect(() =>
      instructionMov.encodeInstruction([
        lowRegisterOption,
        validImmediateOption
      ])
    ).toThrow(InstructionError)
    // MOV R2, 5
    expect(() =>
      instructionMov.encodeInstruction([
        lowRegisterOption2,
        invalidImmediateOption
      ])
    ).toThrow(InstructionError)
    // MOV R2
    expect(() =>
      instructionMov.encodeInstruction([lowRegisterOption2])
    ).toThrow(InstructionError)
  })
})

describe('test executeInstruction function', () => {
  test('MOV handler', () => {
    // MOV SP, R5
    instructionMov.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0100011010101101)],
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
      [Halfword.fromUnsignedInteger(0b0100011001101101)],
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
})
