import {Halfword, Word} from 'types/binary'
import {
  LoadInstructionImmediateOffset,
  LoadInstructionRegisterOffset,
  LoadInstructionImmediateOffsetHalfword,
  LoadInstructionRegisterOffsetHalfword,
  LoadInstructionImmediateOffsetByte,
  LoadInstructionRegisterOffsetByte,
  LoadInstructionPointerOffset
} from 'instruction/instructions/load'
import {ILabelOffsets} from 'instruction/interfaces'
import {mock} from 'ts-mockito'
import {VirtualBoardError} from 'types/error'
import {Register, Registers} from 'board/registers'
import {Memory} from 'board/memory'

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

const registerValueR7: Word = Word.fromUnsignedInteger(0x08000010)
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