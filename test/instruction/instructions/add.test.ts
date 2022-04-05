import { Halfword, Word } from 'types/binary'
import {
  AddInstruction,
  AddsImmediate3Instruction,
  AddsImmediate8Instruction,
  AddsRegistersInstruction
} from 'instruction/instructions/add'
import { ILabelOffsets } from 'instruction/interfaces'
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito'
import { VirtualBoardError } from 'types/error'
import { Register, Registers } from 'board/registers'
import { Memory } from 'board/memory'
import { $enum } from 'ts-enum-util'

const registerOption1: string = 'R1'
const registerValue1: Word = Word.fromUnsignedInteger(0x00a4)
const registerOption2: string = 'R2'
const registerValue2: Word = Word.fromUnsignedInteger(0x12345678)
const registerOption3: string = 'R3'
const registerValue3: Word = Word.fromUnsignedInteger(0xfedcba98)
const registerOption4: string = 'R8'
const registerValue4: Word = Word.fromUnsignedInteger(0xb316)

const addInstruction = new AddInstruction()
const addsRegistersInstruction = new AddsRegistersInstruction()
const addsImmediate3Instruction = new AddsImmediate3Instruction()
const addsImmediate8Instruction = new AddsImmediate8Instruction()

const labelOffsetMock: ILabelOffsets = mock<ILabelOffsets>()
const memoryMock: Memory = mock<Memory>()
const registerMock: Registers = mock<Registers>()
const registers: Registers = instance(registerMock)
when(
  registerMock.readRegister($enum(Register).getValueOrThrow(registerOption1))
).thenReturn(registerValue1)
when(
  registerMock.readRegister($enum(Register).getValueOrThrow(registerOption2))
).thenReturn(registerValue2)
when(
  registerMock.readRegister($enum(Register).getValueOrThrow(registerOption3))
).thenReturn(registerValue3)
when(
  registerMock.readRegister($enum(Register).getValueOrThrow(registerOption4))
).thenReturn(registerValue4)

describe('test encodeInstruction function for ADD', () => {
  it('should create correct opcode for ADD R1, R8', () => {
    expect(
      addInstruction
        .encodeInstruction([registerOption1, registerOption4], labelOffsetMock)
        .toBinaryString()
    ).toEqual('0100010001000001')
  })

  it('should create correct opcode for ADD R8, R1', () => {
    expect(
      addInstruction
        .encodeInstruction([registerOption4, registerOption1], labelOffsetMock)
        .toBinaryString()
    ).toEqual('0100010010001000')
  })
})

describe('test encodeInstruction function for ADDS registers only', () => {
  it('should create correct opcode for ADDS R1, R2, R3', () => {
    expect(
      addsRegistersInstruction
        .encodeInstruction(
          [registerOption1, registerOption2, registerOption3],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0001100011010001')
  })

  it('should throw error for ADDS R1, R8, R1 because of high register', () => {
    expect(() =>
      addsRegistersInstruction.encodeInstruction(
        [registerOption1, registerOption4, registerOption1],
        labelOffsetMock
      )
    ).toThrow()
  })
})
