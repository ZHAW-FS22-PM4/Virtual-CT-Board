import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import {
  StrhImmediate5OffsetInstruction,
  StrhRegisterOffsetInstruction
} from 'instruction/instructions/store/strh'
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
const strLiteralOptionsValidShort = ['03', '[R0]']
const strLiteralOptionsInvalid = ['R0', 'R1', '#0xe6']
const strLiteralOptionsInvalid2 = ['R0', 'R1]', '[#0xe6']

const instructionStoreInstructionImmediateOffsetHalfword =
  new StrhImmediate5OffsetInstruction()
const instructionStoreInstructionRegisterOffsetHalfword =
  new StrhRegisterOffsetInstruction()

const encodingErrorWrongBracketsOn2nd = new InstructionError(
  'Opening or closing bracket missing for 2. param'
)
const encodingErrorWrongBracketsOn2ndOr3rd = new InstructionError(
  'Opening bracket on 2. param or closing bracket on 3. param'
)
const offsetNotHalfwordAligned = new InstructionError(
  'Immediate offset not halfword aligned'
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
  test('STORE instruction - STRH (immediate offset) - halfword encoder', () => {
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strbName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid2
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsValid
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionImmediateOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsValidShort
      )
    ).toBe(true)
  })
  test('STORE instruction - STRH (register offset) - halfword encoder', () => {
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strbName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsInvalid2
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionRegisterOffsetHalfword.canEncodeInstruction(
        strhName,
        strLiteralOptionsValidShort
      )
    ).toBe(false)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('StrhImmediate5OffsetInstruction', () => {
    // STR R1, [R2, #0x02]
    expect(
      instructionStoreInstructionImmediateOffsetHalfword
        .encodeInstruction(['R1', '[R2', '#0x2]'])[0]
        .toBinaryString()
    ).toEqual('1000000001010001')
    expect(
      instructionStoreInstructionImmediateOffsetHalfword
        .encodeInstruction(['R3', '[R7', '#0x3e]'])[0]
        .toBinaryString()
    ).toEqual('1000011111111011')
    expect(
      instructionStoreInstructionImmediateOffsetHalfword
        .encodeInstruction(['R4', '[R4', '#20]'])[0]
        .toBinaryString()
    ).toEqual('1000001010100100')
    expect(
      instructionStoreInstructionImmediateOffsetHalfword
        .encodeInstruction(['R2', '[R2]'])[0]
        .toBinaryString()
    ).toEqual('1000000000010010')
    // STR R1, [R2, R3]
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        'R1',
        '[R2',
        'R3]'
      ])
    ).toThrow(InstructionError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        'R1',
        '[R2'
      ])
    ).toThrow(encodingErrorWrongBracketsOn2nd)
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        'R1',
        'R2',
        '[#5'
      ])
    ).toThrow(encodingErrorWrongBracketsOn2ndOr3rd)
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        'R5',
        '[R2',
        '0x1F'
      ])
    ).toThrow(encodingErrorWrongBracketsOn2ndOr3rd)
    // STR R1, [R2, 5]
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        'R1',
        '[R2',
        '5]'
      ])
    ).toThrow(InstructionError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        'R1',
        '#0x1F]',
        '[R2'
      ])
    ).toThrow(InstructionError)
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        'R1',
        '[R2',
        '#0x9]'
      ])
    ).toThrow(offsetNotHalfwordAligned)
    expect(() =>
      instructionStoreInstructionImmediateOffsetHalfword.encodeInstruction([
        'R1',
        '[R2',
        '#0x13]'
      ])
    ).toThrow(offsetNotHalfwordAligned)
  })
  test('StrhRegisterOffsetInstruction', () => {
    // STR R1, [R2, R3]
    expect(
      instructionStoreInstructionRegisterOffsetHalfword
        .encodeInstruction(['R1', '[R2', 'R3]'])[0]
        .toBinaryString()
    ).toEqual('0101001011010001')
    // STR R1, [R2, #0x1F]
    expect(() =>
      instructionStoreInstructionRegisterOffsetHalfword.encodeInstruction([
        'R1',
        '[R2',
        '#0x1F]'
      ])
    ).toThrow(InstructionError)
    // STR R1, [R2, SP]
    expect(() =>
      instructionStoreInstructionRegisterOffsetHalfword.encodeInstruction([
        'R1',
        '[R2',
        'SP]'
      ])
    ).toThrow(InstructionError)
    // STR R1, [R2, R22]
    expect(() =>
      instructionStoreInstructionRegisterOffsetHalfword.encodeInstruction([
        'R1',
        '[R2',
        'R22]'
      ])
    ).toThrow(InstructionError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionRegisterOffsetHalfword.encodeInstruction([
        'R1',
        '[R2'
      ])
    ).toThrow(InstructionError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionRegisterOffsetHalfword.encodeInstruction([
        'R1',
        '#0x1F]',
        '[R2'
      ])
    ).toThrow(InstructionError)
  })
})

describe('test executeInstruction function', () => {
  test('STRH immediate offset', () => {
    // STR R6, [R7, #0x01] --> offset by 2
    instructionStoreInstructionImmediateOffsetHalfword.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1000000001111110)],
      registers,
      memory
    )
    expect(memory.readWord(registerValueR7.add(2)).toHexString()).toEqual(
      '00005678'
    )
    // LDR R6, [R5]
    instructionStoreInstructionImmediateOffsetHalfword.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0111000000101110)],
      registers,
      memory
    )
    expect(memory.readWord(registerValueR5).toBinaryString()).toEqual(
      '00000000000000000101011001111000'
    )
    //leave remaining values unchanged
    memory.writeWord(registerValueR5, Word.fromUnsignedInteger(0xffffffff))
    instructionStoreInstructionImmediateOffsetHalfword.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0111000000101110)],
      registers,
      memory
    )
    expect(memory.readWord(registerValueR5).value).toEqual(0xffff5678)
    memory.reset()
  })
  test('STRH register offset', () => {
    // STR R6, [R7, R5]
    instructionStoreInstructionRegisterOffsetHalfword.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101000101111110)],
      registers,
      memory
    )
    expect(
      memory.readWord(registerValueR7.add(registerValueR5)).toHexString()
    ).toEqual('00005678')
    memory.reset()
  })
})
