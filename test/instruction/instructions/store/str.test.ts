import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import {
  StrImmediate5OffsetInstruction,
  StrRegisterOffsetInstruction
} from 'instruction/instructions/store/str'
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

const instructionStoreInstructionImmediateOffset =
  new StrImmediate5OffsetInstruction()
const instructionStoreInstructionRegisterOffset =
  new StrRegisterOffsetInstruction()

const encodingErrorWrongBracketsOn2nd = new InstructionError(
  'Opening or closing bracket missing for 2. param'
)
const encodingErrorWrongBracketsOn2ndOr3rd = new InstructionError(
  'Opening bracket on 2. param or closing bracket on 3. param'
)
const offsetNotWordAligned = new InstructionError(
  'Immediate offset not word aligned'
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
  test('STORE instruction - STR (immediate offset) - word encoder', () => {
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strbName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strhName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid2
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsValid
      )
    ).toBe(true)
  })
  test('STORE instruction - STR (register offset) - word encoder', () => {
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strbName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid2
      )
    ).toBe(true)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionStoreInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('StrImmediate5OffsetInstruction', () => {
    expect(
      instructionStoreInstructionImmediateOffset
        .encodeInstruction(['R1', '[R2', '#0x04]'])[0]
        .toBinaryString()
    ).toEqual('0110000001010001')
    expect(
      instructionStoreInstructionImmediateOffset
        .encodeInstruction(['R7', '[R4', '#16]'])[0]
        .toBinaryString()
    ).toEqual('0110000100100111')
    expect(
      instructionStoreInstructionImmediateOffset
        .encodeInstruction(['R6', '[R6', '#0x7c]'])[0]
        .toBinaryString()
    ).toEqual('0110011111110110')
    expect(
      instructionStoreInstructionImmediateOffset
        .encodeInstruction(['R4', '[R7]'])[0]
        .toBinaryString()
    ).toEqual('0110000000111100')
    // STR R1, [R2, R3]
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction([
        'R1',
        '[R2',
        'R3]'
      ])
    ).toThrow(InstructionError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction([
        'R1',
        '[R2'
      ])
    ).toThrow(encodingErrorWrongBracketsOn2nd)
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction([
        'R1',
        '[R2',
        '#5'
      ])
    ).toThrow(encodingErrorWrongBracketsOn2ndOr3rd)
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction([
        'R5',
        'R2]',
        '0x1F]'
      ])
    ).toThrow(encodingErrorWrongBracketsOn2ndOr3rd)
    // STR R1, [R2, 5]
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction([
        'R1',
        '[R2',
        '5]'
      ])
    ).toThrow(InstructionError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction([
        'R1',
        '#0x1F]',
        '[R2'
      ])
    ).toThrow(InstructionError)
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction([
        'R1',
        '[R2',
        '#0x11]'
      ])
    ).toThrow(offsetNotWordAligned)
    expect(() =>
      instructionStoreInstructionImmediateOffset.encodeInstruction([
        'R1',
        '[R2',
        '#0xa2]'
      ])
    ).toThrow(offsetNotWordAligned)
  })
  test('StrRegisterOffsetInstruction', () => {
    // STR R1, [R2, R3]
    expect(
      instructionStoreInstructionRegisterOffset
        .encodeInstruction(['R1', '[R2', 'R3]'])[0]
        .toBinaryString()
    ).toEqual('0101000011010001')
    // STR R1, [R2, #0x1F]
    expect(() =>
      instructionStoreInstructionRegisterOffset.encodeInstruction([
        'R1',
        '[R2',
        '#0x1F]'
      ])
    ).toThrow(InstructionError)
    // STR R1, [R2, SP]
    expect(() =>
      instructionStoreInstructionRegisterOffset.encodeInstruction([
        'R1',
        '[R2',
        'SP]'
      ])
    ).toThrow(InstructionError)
    // STR R1, [R2, R22]
    expect(() =>
      instructionStoreInstructionRegisterOffset.encodeInstruction([
        'R1',
        '[R2',
        'R22]'
      ])
    ).toThrow(InstructionError)
    // STR R5, [R2
    expect(() =>
      instructionStoreInstructionRegisterOffset.encodeInstruction(['R1', '[R2'])
    ).toThrow(InstructionError)
    // STR R5, 0x1F], [R2
    expect(() =>
      instructionStoreInstructionRegisterOffset.encodeInstruction([
        'R1',
        '#0x1F]',
        '[R2'
      ])
    ).toThrow(InstructionError)
  })
})

describe('test executeInstruction function', () => {
  test('STR word immediate offset', () => {
    // STR R6, [R7, #0x01]
    instructionStoreInstructionImmediateOffset.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0110000001111110)],
      registers,
      memory
    )
    expect(memory.readWord(registerValueR7.add(0x04)).toHexString()).toEqual(
      '12345678'
    )
    // LDR R5, [R6]
    memory.writeWord(registerValueR6, Word.fromUnsignedInteger(0xffffffff))
    instructionStoreInstructionImmediateOffset.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0110000000110101)],
      registers,
      memory
    )
    expect(memory.readWord(registerValueR6).toBinaryString()).toEqual(
      '00000000000000000000000100000000'
    )
    memory.reset()
  })
  test('STR word register offset', () => {
    // STR R6, [R7, R5]
    instructionStoreInstructionRegisterOffset.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101000101111110)],
      registers,
      memory
    )
    expect(
      memory.readWord(registerValueR7.add(registerValueR5.value)).toHexString()
    ).toEqual('12345678')
    memory.reset()
  })
})
