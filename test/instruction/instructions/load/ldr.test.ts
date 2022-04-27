import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import {
  LdrImmediate5OffsetInstruction,
  LdrRegisterInstruction,
  LdrRegisterOffsetInstruction
} from 'instruction/instructions/load/ldr'
import { Halfword, Word } from 'types/binary'
import { VirtualBoardError } from 'types/error'

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

const instructionLoadInstructionImmediateOffset =
  new LdrImmediate5OffsetInstruction()
const instructionLoadInstructionRegisterOffset =
  new LdrRegisterOffsetInstruction()
const instructionLoadInstructionPointerOffset = new LdrRegisterInstruction()

const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR7: Word = Word.fromUnsignedInteger(0x00000000)
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
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        strbName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        strhName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionImmediateOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsValid
      )
    ).toBe(true)
  })
  test('LOAD instruction - LDR (register offset) - word encoder', () => {
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        strbName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strLiteralOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionRegisterOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(true)
  })
  test('LOAD instruction - LDR (pointer + offset) - word', () => {
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        strName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        strName,
        strPCOptionsValid
      )
    ).toBe(true)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        strhName,
        strRegisterOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        strbName,
        strLiteralOptionsValid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        strbName,
        strRegisterOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        strbName,
        strRegisterOptionsInvalid2
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        strbName,
        strLiteralOptionsInvalid
      )
    ).toBe(false)
    expect(
      instructionLoadInstructionPointerOffset.canEncodeInstruction(
        strbName,
        strPCOptionsValid
      )
    ).toBe(false)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('LdrImmediate5OffsetInstruction', () => {
    // LDR R1, [R2, #0x01]
    expect(
      instructionLoadInstructionImmediateOffset
        .encodeInstruction([
          lowRegisterOption,
          lowRegisterOption2,
          validImmediateOptionLow
        ])[0]
        .toBinaryString()
    ).toEqual('0110100001010001')
    // LDR R1, [R2, #0x1F]
    expect(
      instructionLoadInstructionImmediateOffset
        .encodeInstruction([
          lowRegisterOption,
          lowRegisterOption2,
          validImmediateOptionHigh
        ])[0]
        .toBinaryString()
    ).toEqual('0110111111010001')
    // LDR R1, [R2, R3]
    expect(() =>
      instructionLoadInstructionImmediateOffset.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        lowRegisterOption3
      ])
    ).toThrow(VirtualBoardError)
    // LDR R5, [R2
    expect(() =>
      instructionLoadInstructionImmediateOffset.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
    // LDR R1, [R2, 5]
    expect(() =>
      instructionLoadInstructionImmediateOffset.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        invalidImmediateOption
      ])
    ).toThrow(VirtualBoardError)
    // LDR R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionImmediateOffset.encodeInstruction([
        lowRegisterOption,
        validImmediateOptionHigh,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
  })
  test('LdrRegisterOffsetInstruction', () => {
    // LDR R1, [R2, R3]
    expect(
      instructionLoadInstructionRegisterOffset
        .encodeInstruction([
          lowRegisterOption,
          lowRegisterOption2,
          lowRegisterOption3
        ])[0]
        .toBinaryString()
    ).toEqual('0101100011010001')
    // LDR R1, [R2, #0x1F]
    expect(() =>
      instructionLoadInstructionRegisterOffset.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        validImmediateOptionHigh
      ])
    ).toThrow(VirtualBoardError)
    // LDR R1, [R2, SP]
    expect(() =>
      instructionLoadInstructionRegisterOffset.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        highRegisterOption
      ])
    ).toThrow(VirtualBoardError)
    // LDR R1, [R2, R22]
    expect(() =>
      instructionLoadInstructionRegisterOffset.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        invalidRegisterOption
      ])
    ).toThrow(VirtualBoardError)
    // LDR R5, [R2
    expect(() =>
      instructionLoadInstructionRegisterOffset.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
    // LDR R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionRegisterOffset.encodeInstruction([
        lowRegisterOption,
        validImmediateOptionHigh,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
  })
  test('LoadRegisterInstruction', () => {
    // LDR R1, [SP, #0x01]
    expect(
      instructionLoadInstructionPointerOffset
        .encodeInstruction([
          lowRegisterOption,
          highRegisterOption,
          validImmediateOptionLow
        ])[0]
        .toBinaryString()
    ).toEqual('0100100100000001')
    // LDR R1, [SP, #0x1F]
    expect(
      instructionLoadInstructionPointerOffset
        .encodeInstruction([
          lowRegisterOption,
          highRegisterOption,
          validImmediateOptionHigh
        ])[0]
        .toBinaryString()
    ).toEqual('0100100100011111')
    // LDR R1, [R2, R3]
    expect(() =>
      instructionLoadInstructionPointerOffset.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        lowRegisterOption3
      ])
    ).toThrow(VirtualBoardError)
    // LDR R5, [R2
    expect(() =>
      instructionLoadInstructionPointerOffset.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
    // LDR R1, [R2, 5]
    expect(() =>
      instructionLoadInstructionPointerOffset.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        invalidImmediateOption
      ])
    ).toThrow(VirtualBoardError)
    // LDR R5, 0x1F], [R2
    expect(() =>
      instructionLoadInstructionPointerOffset.encodeInstruction([
        lowRegisterOption,
        validImmediateOptionHigh,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
  })
})

describe('test executeInstruction function', () => {
  test('LDR word immediate offset', () => {
    // LDR R7, [R6, #0x01]

    memory.writeWord(
      registerValueR6.add(0x01),
      Word.fromUnsignedInteger(0x0009)
    )
    instructionLoadInstructionImmediateOffset.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0110100001110111)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
  test('LDR word register offset', () => {
    // LDR R7, [R6, R5]
    memory.writeWord(
      registerValueR6.add(registerValueR5),
      Word.fromUnsignedInteger(0x0009)
    )
    instructionLoadInstructionRegisterOffset.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101100101110111)],
      registers,
      memory
    )
    //expect(memory.readWord(registerValueR6.add(registerValueR5)).value).toEqual(9)
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
})
