import { Halfword, Word } from 'types/binary'
import {
  StoreInstructionImmediateOffset, StoreInstructionImmediateOffsetByte, StoreInstructionImmediateOffsetHalfword,
  StoreInstructionRegisterOffset, StoreInstructionRegisterOffsetByte, StoreInstructionRegisterOffsetHalfword
} from 'instruction/instructions/store'
import { ILabelOffsets } from 'instruction/interfaces'
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito'
import { VirtualBoardError } from 'types/error'
import { Register, Registers } from 'board/registers'
import { Memory } from 'board/memory'
import { $enum } from 'ts-enum-util'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'

const invalidInstructionOptions = ['R77', '#2#']

const strName = 'STR'
const strbName = 'STRB'
const strhName = 'STRH'

const strRegisterOptions = ['R0', 'R1', 'R2']
const strLiteralOptions = ['R0', 'R1', '#0xe6']

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

const instructionStoreInstructionImmediateOffset = new StoreInstructionImmediateOffset()
const instructionStoreInstructionRegisterOffset = new StoreInstructionRegisterOffset()
const instructionStoreInstructionImmediateOffsetHalfword = new StoreInstructionImmediateOffsetHalfword()
const instructionStoreInstructionRegisterOffsetHalfword = new StoreInstructionRegisterOffsetHalfword()
const instructionStoreInstructionImmediateOffsetByte = new StoreInstructionImmediateOffsetByte()
const instructionStoreInstructionRegisterOffsetByte = new StoreInstructionRegisterOffsetByte()

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
  test('STORE instruction - STR (immediate offset) - word encoder', () => {
    expect(
        instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(instructionStoreInstructionImmediateOffset.canEncodeInstruction(strbName, strLiteralOptions)).toBe(false)
    expect(instructionStoreInstructionImmediateOffset.canEncodeInstruction(strhName, strLiteralOptions)).toBe(false)
    expect(instructionStoreInstructionImmediateOffset.canEncodeInstruction(strName, strRegisterOptions)).toBe(false)
    expect(instructionStoreInstructionImmediateOffset.canEncodeInstruction(strName, strLiteralOptions)).toBe(true)
  })
  test('STORE instruction - STR (register offset) - word encoder', () => {
    expect(
        instructionStoreInstructionRegisterOffset.canEncodeInstruction(
            invalidInstructionName,
            invalidInstructionOptions
        )
    ).toBe(false)
    expect(instructionStoreInstructionRegisterOffset.canEncodeInstruction(strbName, strRegisterOptions)).toBe(false)
    expect(instructionStoreInstructionRegisterOffset.canEncodeInstruction(strhName, strRegisterOptions)).toBe(false)
    expect(instructionStoreInstructionRegisterOffset.canEncodeInstruction(strName, strLiteralOptions)).toBe(false)
    expect(instructionStoreInstructionRegisterOffset.canEncodeInstruction(strName, strRegisterOptions)).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {


  // todo : test are copied from the mov tests. need to get changed accordingly.
  test('MOV handler', () => {
    // MOV SP, R5
    expect(
        instructionStoreInstructionImmediateOffset
        .encodeInstruction(
          [highRegisterOption, lowRegisterOption],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0100011010101101')
    // MOV R5, SP
    expect(
        instructionStoreInstructionImmediateOffset
        .encodeInstruction(
          [lowRegisterOption, highRegisterOption],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0100011001101101')
    // MOV R5, R22
    expect(() =>
        instructionStoreInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, invalidRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // MOV R5, #0x5C
    expect(() =>
        instructionStoreInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption, validImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // MOV R2, 5
    expect(() =>
        instructionStoreInstructionImmediateOffset.encodeInstruction(
        [lowRegisterOption2, invalidImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // MOV R2
    expect(() =>
        instructionStoreInstructionImmediateOffset.encodeInstruction([lowRegisterOption2], labelOffsetMock)
    ).toThrow(VirtualBoardError)
  })
})

describe('test executeInstruction function', () => {


  // todo : test are copied from the mov tests. need to get changed accordingly.
  test('MOV handler', () => {
    // MOV SP, R5
    instructionStoreInstructionImmediateOffset.executeInstruction(
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
    instructionStoreInstructionImmediateOffset.executeInstruction(
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

})
