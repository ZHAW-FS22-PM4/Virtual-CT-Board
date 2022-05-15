import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import {
  StrbImmediate5OffsetInstruction,
  StrbRegisterOffsetInstruction
} from 'instruction/instructions/store/strb'
import { Halfword, Word } from 'types/binary'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'

const invalidInstructionOptions = ['R77', '#2#']

const strName = 'STR'
const strbName = 'STRB'
const strhName = 'STRH'

const strRegisterOptionsValid = ['R0', '[R1', 'R2]']
const strRegisterOptionsInvalid = ['R0', 'R1', 'R2']
const strRegisterOptionsInvalid2 = ['R0', 'R1]', '[R2']
const strLiteralOptionsValid = ['R0', '[R1', '#0xe6]']
const strLiteralOptionsInvalid = ['R0', 'R1', '#0xe6']
const strLiteralOptionsInvalid2 = ['R0', 'R1]', '[#0xe6']

const instructionStoreInstructionImmediateOffsetByte =
  new StrbImmediate5OffsetInstruction()
const instructionStoreInstructionRegisterOffsetByte =
  new StrbRegisterOffsetInstruction()

const encodingErrorWrongBracketsOn2nd = new InstructionError(
  'Opening or closing bracket missing for 2. param'
)
const encodingErrorWrongBracketsOn2ndOr3rd = new InstructionError(
  'Opening bracket on 2. param or closing bracket on 3. param'
)

const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR7: Word = Word.fromUnsignedInteger(0x08000010)
const registerValueR6: Word = Word.fromUnsignedInteger(0x12345678)
const registerValueR5: Word = Word.fromUnsignedInteger(0x00000100)

registers.writeRegister(Register.R7, registerValueR7)
registers.writeRegister(Register.R6, registerValueR6)
registers.writeRegister(Register.R5, registerValueR5)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('STORE instruction - STRB (immediate offset) - byte encoder', () => {
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strhName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strbName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strbName,
        strLiteralOptionsInvalid
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strbName,
        strLiteralOptionsInvalid2
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionImmediateOffsetByte.canEncodeInstruction(
        strbName,
        strLiteralOptionsValid
      )
    ).toBe(true)
  })
  test('STORE instruction - STRB (register offset) - byte encoder', () => {
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strbName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strbName,
        strRegisterOptionsInvalid
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strbName,
        strRegisterOptionsInvalid2
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strbName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetByte.canEncodeInstruction(
        strbName,
        strRegisterOptionsValid
      )
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('StrbImmediate5OffsetInstruction', () => {
    // STR R1, [R2, #0x01]
    expect(
      instructionStoreInstructionImmediateOffsetByte
        .encodeInstruction(['R1', '[R2', '#0x01]'])[0]
        .toBinaryString()
    ).toEqual('0111000001010001')
    // STR R1, [R2, #0x1F]
    expect(
      instructionStoreInstructionImmediateOffsetByte
        .encodeInstruction(['R1', '[R2', '#0x1F]'])[0]
        .toBinaryString()
    ).toEqual('0111011111010001')
    expect(
      instructionStoreInstructionImmediateOffsetByte
        .encodeInstruction(['R4', '[R0]'])[0]
        .toBinaryString()
    ).toEqual('0111000000000100')
    // STR R1, [R2, R3]
    expect(() =>
      instructionStoreInstructionImmediateOffsetByte.encodeInstruction([
        'R1',
        '[R2',
        'R3]'
      ])
    ).toThrow(InstructionError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionImmediateOffsetByte.encodeInstruction([
        'R1',
        '[R2'
      ])
    ).toThrow(encodingErrorWrongBracketsOn2nd)
    expect(() =>
      instructionStoreInstructionImmediateOffsetByte.encodeInstruction([
        'R1',
        'R2',
        '#5]'
      ])
    ).toThrow(encodingErrorWrongBracketsOn2ndOr3rd)
    expect(() =>
      instructionStoreInstructionImmediateOffsetByte.encodeInstruction([
        'R5',
        '[R2',
        '[0x1F'
      ])
    ).toThrow(encodingErrorWrongBracketsOn2ndOr3rd)
    // STR R1, [R2, 5]
    expect(() =>
      instructionStoreInstructionImmediateOffsetByte.encodeInstruction([
        'R1',
        '[R2',
        '5]'
      ])
    ).toThrow(InstructionError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionImmediateOffsetByte.encodeInstruction([
        'R1',
        '#0x1F]',
        '[R2'
      ])
    ).toThrow(InstructionError)
  })
  test('StrbRegisterOffsetInstruction', () => {
    // STR R1, [R2, R3]
    expect(
      instructionStoreInstructionRegisterOffsetByte
        .encodeInstruction(['R1', '[R2', 'R3]'])[0]
        .toBinaryString()
    ).toEqual('0101010011010001')
    // STR R1, [R2, #0x1F]
    expect(() =>
      instructionStoreInstructionRegisterOffsetByte.encodeInstruction([
        'R1',
        '[R2',
        '#0x1F]'
      ])
    ).toThrow(InstructionError)
    // STR R1, [R2, SP]
    expect(() =>
      instructionStoreInstructionRegisterOffsetByte.encodeInstruction([
        'R1',
        '[R2',
        'SP]'
      ])
    ).toThrow(InstructionError)
    // STR R1, [R2, R22]
    expect(() =>
      instructionStoreInstructionRegisterOffsetByte.encodeInstruction([
        'R1',
        '[R2',
        'R22]'
      ])
    ).toThrow(InstructionError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionRegisterOffsetByte.encodeInstruction([
        'R1',
        '[R2'
      ])
    ).toThrow(InstructionError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionRegisterOffsetByte.encodeInstruction([
        'R1',
        '#0x1F]',
        '[R2'
      ])
    ).toThrow(InstructionError)
  })
})

describe('test executeInstruction function', () => {
  test('STRB immediate offset', () => {
    // STR R6, [R7, #0x01]
    instructionStoreInstructionImmediateOffsetByte.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0111000001111110)],
      registers,
      memory
    )
    expect(memory.readWord(registerValueR7.add(0x01)).toHexString()).toEqual(
      '00000078'
    )
    // LDR R6, [R5]
    instructionStoreInstructionImmediateOffsetByte.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0111000000101110)],
      registers,
      memory
    )
    expect(memory.readWord(registerValueR5).toBinaryString()).toEqual(
      '00000000000000000000000001111000'
    )
    //leave remaining values unchanged
    memory.writeWord(registerValueR5, Word.fromUnsignedInteger(0xffffffff))
    instructionStoreInstructionImmediateOffsetByte.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0111000000101110)],
      registers,
      memory
    )
    expect(memory.readWord(registerValueR5).value).toEqual(0xffffff78)
    memory.reset()
  })
  test('STRB register offset', () => {
    // STR R6, [R7, R5]
    instructionStoreInstructionRegisterOffsetByte.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101010101111110)],
      registers,
      memory
    )
    expect(
      memory.readWord(registerValueR7.add(registerValueR5)).toHexString()
    ).toEqual('00000078')
    memory.reset()
  })
})
