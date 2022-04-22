import { EncoderError } from 'assembler/parser/error'
import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import {
  LdrImmediate5OffsetInstruction,
  LdrRegisterInstruction,
  LdrRegisterOffsetInstruction
} from 'instruction/instructions/load/ldr'
import { ILabelOffsets } from 'instruction/interfaces'
import { mock } from 'ts-mockito'
import { Halfword, Word } from 'types/binary'
import { VirtualBoardError } from 'types/error'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'

const invalidInstructionOptions = ['R77', '#2#']

const ldrName = 'LDR'
const ldrbName = 'LDRB'
const ldrhName = 'LDRH'

const ldrRegisterOptionsValid = ['R0', '[R1', 'R2]']
const ldrRegisterOptionsValidShort = ['R3', '[R4]']
const ldrRegisterOptionsInvalid = ['R0', 'R1', 'R2']
const ldrRegisterOptionsInvalid2 = ['R0', 'R1]', '[R2']
const ldrLiteralOptionsValid = ['R0', '[R1', '#0xe6]']
const ldrLiteralOptionsInvalid = ['R0', 'R1', '#0xe6']
const ldrLiteralOptionsInvalid2 = ['R0', 'R1]', '[#0xe6']
const ldrPCOptionsValid = ['R0', '[PC', '#0xe6]']
const ldrPCOptionsValid2 = ['R7', '[PC', '#0x00]']
const ldrOptionsWriteToPCInvalid = ['PC', '[R3', '#0x8]']

const lowRegisterOption: string = 'R1'
const lowRegisterOption2: string = '[R2'
const lowRegisterOption3: string = 'R3]'
const validImmediateOptionLow: string = '#0x01]'
const validImmediateOptionHigh: string = '#0x1F]'
const invalidImmediateOption: string = '5'

const highRegisterOption: string = 'SP'
const invalidRegisterOption: string = 'R22'

const instrLdrImm = new LdrImmediate5OffsetInstruction()
const instrLdrReg = new LdrRegisterOffsetInstruction()
const instrLdrPointer = new LdrRegisterInstruction()

const labelOffsetMock: ILabelOffsets = mock<ILabelOffsets>()
const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR7: Word = Word.fromUnsignedInteger(0x00000000)
const registerValueR6: Word = Word.fromUnsignedInteger(0x12345678)
const registerValueR5: Word = Word.fromUnsignedInteger(0x00000100)

const encodingErrorWrongBracketsOn2nd = new EncoderError(
  'opening or closing bracket missing for 2nd param'
)
const encodingErrorWrongBracketsOn2ndOr3rd = new EncoderError(
  'opening bracket on 2nd param or closing bracket on 3rd param'
)

registers.writeRegister(Register.R7, registerValueR7)
registers.writeRegister(Register.R6, registerValueR6)
registers.writeRegister(Register.R5, registerValueR5)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('LdrImmediate5OffsetInstruction - LDR (immediate offset) - word encoder', () => {
    expect(
      instrLdrImm.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instrLdrImm.canEncodeInstruction(ldrbName, ldrLiteralOptionsValid)
    ).toBe(false)
    expect(
      instrLdrImm.canEncodeInstruction(ldrhName, ldrLiteralOptionsValid)
    ).toBe(false)
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrRegisterOptionsValid)
    ).toBe(false)

    //TODO check invalid options in encodeMethod of instructionLoadInstructionImmediateOffset
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrRegisterOptionsInvalid)
    ).toBe(true)
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrRegisterOptionsInvalid2)
    ).toBe(true)
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrLiteralOptionsInvalid)
    ).toBe(true)
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrLiteralOptionsInvalid2)
    ).toBe(true)
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrOptionsWriteToPCInvalid)
    ).toBe(true)
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrLiteralOptionsValid)
    ).toBe(true)
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrRegisterOptionsValidShort)
    ).toBe(true)
  })
  test('LdrRegisterOffsetInstruction - LDR (register offset) - word encoder', () => {
    expect(
      instrLdrReg.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instrLdrReg.canEncodeInstruction(ldrbName, ldrRegisterOptionsValid)
    ).toBe(false)
    expect(
      instrLdrReg.canEncodeInstruction(ldrhName, ldrRegisterOptionsValid)
    ).toBe(false)
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrLiteralOptionsValid)
    ).toBe(false)
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrRegisterOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrRegisterOptionsInvalid2)
    ).toBe(false)
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrLiteralOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrLiteralOptionsInvalid2)
    ).toBe(false)
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrRegisterOptionsValidShort)
    ).toBe(false)
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrOptionsWriteToPCInvalid)
    ).toBe(false)
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrRegisterOptionsValid)
    ).toBe(true)
  })
  test('LdrRegisterInstruction - LDR (programm counter + offset) - word', () => {
    expect(
      instrLdrPointer.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instrLdrPointer.canEncodeInstruction(ldrName, ldrRegisterOptionsValid)
    ).toBe(false)
    expect(
      instrLdrPointer.canEncodeInstruction(ldrName, ldrPCOptionsValid)
    ).toBe(true)
    expect(
      instrLdrPointer.canEncodeInstruction(ldrhName, ldrRegisterOptionsValid)
    ).toBe(false)
    expect(
      instrLdrPointer.canEncodeInstruction(ldrbName, ldrLiteralOptionsValid)
    ).toBe(false)
    expect(
      instrLdrPointer.canEncodeInstruction(ldrbName, ldrRegisterOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrPointer.canEncodeInstruction(ldrbName, ldrRegisterOptionsInvalid2)
    ).toBe(false)
    expect(
      instrLdrPointer.canEncodeInstruction(ldrbName, ldrLiteralOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrPointer.canEncodeInstruction(ldrbName, ldrPCOptionsValid)
    ).toBe(false)

    expect(
      instrLdrPointer.canEncodeInstruction(
        ldrName,
        ldrRegisterOptionsValidShort
      )
    ).toBe(false)

    expect(
      instrLdrPointer.canEncodeInstruction(ldrName, ldrOptionsWriteToPCInvalid)
    ).toBe(false)

    expect(
      instrLdrPointer.canEncodeInstruction(ldrName, ldrPCOptionsValid2)
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('LdrImmediate5OffsetInstruction', () => {
    // LDR R1, [R2, #0x01]
    expect(
      instrLdrImm
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, validImmediateOptionLow],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0110100001010001')
    // LDR R1, [R2, #0x1F]
    expect(
      instrLdrImm
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0110111111010001')
    // LDR R3, [R6]
    expect(
      instrLdrImm
        .encodeInstruction(['R3', '[R6]'], labelOffsetMock)
        .toBinaryString()
    ).toEqual('0110100000110011')
    // LDR R1, [R2, R3]
    expect(() =>
      instrLdrImm.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R5, [R2
    expect(() =>
      instrLdrImm.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(encodingErrorWrongBracketsOn2nd)
    // LDR R1, [R2, 5
    expect(() =>
      instrLdrImm.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidImmediateOption],
        labelOffsetMock
      )
    ).toThrow(encodingErrorWrongBracketsOn2ndOr3rd)
    // LDR R5, 0x1F], [R2
    expect(() =>
      instrLdrImm.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(encodingErrorWrongBracketsOn2ndOr3rd)
  })
  test('LdrRegisterOffsetInstruction', () => {
    // LDR R1, [R2, R3]
    expect(
      instrLdrReg
        .encodeInstruction(
          [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0101100011010001')
    // LDR R1, [R2, #0x1F]
    expect(() =>
      instrLdrReg.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, validImmediateOptionHigh],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R1, [R2, SP]
    expect(() =>
      instrLdrReg.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, highRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R1, [R2, R22]
    expect(() =>
      instrLdrReg.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidRegisterOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R5, [R2
    expect(() =>
      instrLdrReg.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R5, 0x1F], [R2
    expect(() =>
      instrLdrReg.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
  test('LoadRegisterInstruction', () => {
    // LDR R1, [SP, #0x01]
    expect(
      instrLdrPointer
        .encodeInstruction(
          [lowRegisterOption, highRegisterOption, validImmediateOptionLow],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0100100100000001')
    // LDR R1, [SP, #0x1F]
    expect(
      instrLdrPointer
        .encodeInstruction(
          [lowRegisterOption, highRegisterOption, validImmediateOptionHigh],
          labelOffsetMock
        )
        .toBinaryString()
    ).toEqual('0100100100011111')
    // LDR R1, [R2, R3]
    expect(() =>
      instrLdrPointer.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, lowRegisterOption3],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R5, [R2
    expect(() =>
      instrLdrPointer.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R1, [R2, 5]
    expect(() =>
      instrLdrPointer.encodeInstruction(
        [lowRegisterOption, lowRegisterOption2, invalidImmediateOption],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
    // LDR R5, 0x1F], [R2
    expect(() =>
      instrLdrPointer.encodeInstruction(
        [lowRegisterOption, validImmediateOptionHigh, lowRegisterOption2],
        labelOffsetMock
      )
    ).toThrow(VirtualBoardError)
  })
})

describe('test executeInstruction function', () => {
  test('LdrImmediate5OffsetInstruction - LDR word immediate offset', () => {
    // LDR R7, [R6, #0x01]

    memory.writeWord(
      registerValueR6.add(0x01),
      Word.fromUnsignedInteger(0x0009)
    )
    instrLdrImm.executeInstruction(
      Halfword.fromUnsignedInteger(0b0110100001110111),
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
  test('LdrRegisterOffsetInstruction - LDR word register offset', () => {
    // LDR R7, [R6, R5]
    memory.writeWord(
      registerValueR6.add(registerValueR5),
      Word.fromUnsignedInteger(0x0009)
    )
    instrLdrReg.executeInstruction(
      Halfword.fromUnsignedInteger(0b0101100101110111),
      registers,
      memory
    )
    //expect(memory.readWord(registerValueR6.add(registerValueR5)).value).toEqual(9)
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
})
