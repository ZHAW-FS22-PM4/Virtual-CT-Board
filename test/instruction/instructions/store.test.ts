import {Halfword, Word} from 'types/binary'
import {
  StoreInstructionImmediateOffset,
  StoreInstructionImmediateOffsetByte,
  StoreInstructionImmediateOffsetHalfword,
  StoreInstructionRegisterOffset,
  StoreInstructionRegisterOffsetByte,
  StoreInstructionRegisterOffsetHalfword
} from 'instruction/instructions/store'
import {ILabelOffsets} from 'instruction/interfaces'
import {instance, mock, resetCalls, verify, when} from 'ts-mockito'
import {VirtualBoardError} from 'types/error'
import {Register, Registers} from 'board/registers'
import {Memory} from 'board/memory'
import {$enum} from 'ts-enum-util'
import {removeBracketsFromRegisterString} from "../../../src/instruction/opcode";

const invalidInstructionName = 'NeverGonnaBeAnInstruction'

const invalidInstructionOptions = ['R77', '#2#']

const strName = 'STR'
const strbName = 'STRB'
const strhName = 'STRH'

const strRegisterOptionsValid = ['R0', '[R1', 'R2]']
const strRegisterOptionsInvalid = ['R0', 'R1', 'R2']
const strLiteralOptionsValid = ['R0', '[R1', '#0xe6]']
const strLiteralOptionsInvalid = ['R0', 'R1', '#0xe6']

const lowRegisterOption: string = 'R1'
const lowRegisterValue: Word = Word.fromUnsignedInteger(0x5555)
const lowRegisterOption2: string = '[R2'
const lowRegisterValue2: Word = Word.fromUnsignedInteger(0x2222)
const lowRegisterOption3: string = 'R3]'
const lowRegisterValue3: Word = Word.fromUnsignedInteger(0x2222)
const validImmediateOptionLow: string = '#0x01]'
const validImmediateOptionHigh: string = '#0xFF'
const invalidImmediateOption: string = '5'
const toolongImmediateOption: string = '#0x111'


const highRegisterOption: string = 'SP'
const highRegisterValue: Word = Word.fromUnsignedInteger(0x13131313)
const invalidRegisterOption: string = 'R22'

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
const registersWithValue: Registers = instance(registerMock)
registersWithValue.writeRegister(Register.R7, Word.fromUnsignedInteger(51240930))
registersWithValue.writeRegister(Register.R6, Word.fromUnsignedInteger(53687912))

when(
  registerMock.readRegister($enum(Register).getValueOrThrow(removeBracketsFromRegisterString(lowRegisterOption)))
).thenReturn(lowRegisterValue)
when(
  registerMock.readRegister($enum(Register).getValueOrThrow(removeBracketsFromRegisterString(lowRegisterOption2)))
).thenReturn(lowRegisterValue2)
when(
    registerMock.readRegister($enum(Register).getValueOrThrow(removeBracketsFromRegisterString(lowRegisterOption3)))
).thenReturn(lowRegisterValue3)
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
    expect(instructionStoreInstructionImmediateOffset.canEncodeInstruction(strbName, strLiteralOptionsValid)).toBe(false)
    expect(instructionStoreInstructionImmediateOffset.canEncodeInstruction(strhName, strLiteralOptionsValid)).toBe(false)
    expect(instructionStoreInstructionImmediateOffset.canEncodeInstruction(strName, strRegisterOptionsValid)).toBe(false)
    expect(instructionStoreInstructionImmediateOffset.canEncodeInstruction(strName, strRegisterOptionsInvalid)).toBe(false)
    expect(instructionStoreInstructionImmediateOffset.canEncodeInstruction(strName, strLiteralOptionsInvalid)).toBe(false)
    expect(instructionStoreInstructionImmediateOffset.canEncodeInstruction(strName, strLiteralOptionsValid)).toBe(true)
  })
  test('STORE instruction - STR (register offset) - word encoder', () => {
    expect(
        instructionStoreInstructionRegisterOffset.canEncodeInstruction(
            invalidInstructionName,
            invalidInstructionOptions
        )
    ).toBe(false)
    expect(instructionStoreInstructionRegisterOffset.canEncodeInstruction(strbName, strRegisterOptionsValid)).toBe(false)
    expect(instructionStoreInstructionRegisterOffset.canEncodeInstruction(strhName, strRegisterOptionsValid)).toBe(false)
    expect(instructionStoreInstructionRegisterOffset.canEncodeInstruction(strName, strLiteralOptionsValid)).toBe(false)
    expect(instructionStoreInstructionRegisterOffset.canEncodeInstruction(strName, strRegisterOptionsInvalid)).toBe(false)
    expect(instructionStoreInstructionRegisterOffset.canEncodeInstruction(strName, strLiteralOptionsInvalid)).toBe(false)
    expect(instructionStoreInstructionRegisterOffset.canEncodeInstruction(strName, strRegisterOptionsValid)).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {


  // todo : test are copied from the mov tests. need to get changed accordingly.
  test('StoreInstructionImmediateOffset', () => {
    // STR R0, [R1, #0x01]
    expect(
        instructionStoreInstructionImmediateOffset
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, validImmediateOptionLow],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0110000001010001')
    // STR R0, [R1, #0x01]
    expect(
        instructionStoreInstructionImmediateOffset
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, validImmediateOptionLow],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0110000001010001')
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
        [lowRegisterOption, validImmediateOptionLow],
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
  test('STR word immediate offset', () => {
    // STR R7, [R6, #0x01]
    instructionStoreInstructionImmediateOffset.executeInstruction(
      Halfword.fromUnsignedInteger(0b0110000001111110),
      registersWithValue,
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
