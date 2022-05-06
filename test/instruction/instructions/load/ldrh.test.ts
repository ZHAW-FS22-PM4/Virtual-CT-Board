import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import {
  LdrhImmediate5OffsetInstruction,
  LdrhRegisterOffsetInstruction
} from 'instruction/instructions/load/ldrh'
import { Halfword, Word } from 'types/binary'
import { VirtualBoardError } from 'types/error'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'

const invalidInstructionOptions = ['R77', '#2#']

const ldrName = 'LDR'
const ldrbName = 'LDRB'
const ldrhName = 'LDRH'

const ldrRegisterOptionsValid = ['R0', '[R1', 'R2]']
const ldrRegisterOptionsInvalid = ['R0', 'R1', 'R2']
const ldrRegisterOptionsInvalid2 = ['R0', 'R1]', '[R2']
const ldrLiteralOptionsValid = ['R0', '[R1', '#0xe6]']
const ldrLiteralOptionsInvalid = ['R0', 'R1', '#0xe6']
const ldrLiteralOptionsInvalid2 = ['R0', 'R1]', '[#0xe6']

const lowRegisterOption: string = 'R1'
const lowRegisterOption2: string = '[R2'
const lowRegisterOption3: string = 'R3]'
const validImmediateOptionLow: string = '#0x01]'
const validImmediateOptionHigh: string = '#0x1F]'
const invalidImmediateOption: string = '5'

const highRegisterOption: string = 'SP'
const invalidRegisterOption: string = 'R22'

const instrLdrhImm = new LdrhImmediate5OffsetInstruction()
const instrLdrhReg = new LdrhRegisterOffsetInstruction()

const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR7: Word = Word.fromUnsignedInteger(0x00000000)
const registerValueR6: Word = Word.fromUnsignedInteger(0x12345678)
const registerValueR5: Word = Word.fromUnsignedInteger(0x00000100)

registers.writeRegister(Register.R7, registerValueR7)
registers.writeRegister(Register.R6, registerValueR6)
registers.writeRegister(Register.R5, registerValueR5)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('LOAD instruction - LDRH (immediate offset) - halfword encoder', () => {
    expect(
      instrLdrhImm.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instrLdrhImm.canEncodeInstruction(ldrbName, ldrLiteralOptionsValid)
    ).toBe(false)
    expect(
      instrLdrhImm.canEncodeInstruction(ldrName, ldrLiteralOptionsValid)
    ).toBe(false)
    expect(
      instrLdrhImm.canEncodeInstruction(ldrhName, ldrRegisterOptionsValid)
    ).toBe(false)
    expect(
      instrLdrhImm.canEncodeInstruction(ldrhName, ldrRegisterOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrhImm.canEncodeInstruction(ldrhName, ldrRegisterOptionsInvalid2)
    ).toBe(false)
    expect(
      instrLdrhImm.canEncodeInstruction(ldrhName, ldrLiteralOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrhImm.canEncodeInstruction(ldrhName, ldrLiteralOptionsInvalid2)
    ).toBe(false)
    expect(
      instrLdrhImm.canEncodeInstruction(ldrhName, ldrLiteralOptionsValid)
    ).toBe(true)
  })
  test('LOAD instruction - LDRH (register offset) - halfword encoder', () => {
    expect(
      instrLdrhReg.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrbName, ldrRegisterOptionsValid)
    ).toBe(false)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrName, ldrRegisterOptionsValid)
    ).toBe(false)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrhName, ldrLiteralOptionsValid)
    ).toBe(false)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrhName, ldrRegisterOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrhName, ldrRegisterOptionsInvalid2)
    ).toBe(false)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrhName, ldrLiteralOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrhName, ldrLiteralOptionsInvalid2)
    ).toBe(false)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrhName, ldrRegisterOptionsValid)
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('LdrhImmediate5OffsetInstruction', () => {
    expect(
      instrLdrhImm.encodeInstruction(['R1', '[R2', '#0x2]'])[0].toBinaryString()
    ).toEqual('1000100001010001')
    expect(
      instrLdrhImm
        .encodeInstruction(['R1', '[R2', '#0x3e]'])[0]
        .toBinaryString()
    ).toEqual('1000111111010001')
    expect(
      instrLdrhImm.encodeInstruction(['R0', '[R4', '#0x1a]'])[0].toHexString()
    ).toEqual('8b60')
    expect(
      instrLdrhImm.encodeInstruction(['R7', '[R5', '#0x3e]'])[0].toHexString()
    ).toEqual('8fef')
    // LDRH R1, [R2, R3]
    expect(() =>
      instrLdrhImm.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        lowRegisterOption3
      ])
    ).toThrow(VirtualBoardError)
    // LDRH R5, [R2
    expect(() =>
      instrLdrhImm.encodeInstruction([lowRegisterOption, lowRegisterOption2])
    ).toThrow(VirtualBoardError)
    // LDRH R1, [R2, 5]
    expect(() =>
      instrLdrhImm.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        invalidImmediateOption
      ])
    ).toThrow(VirtualBoardError)
    // LDRH R5, 0x1F], [R2
    expect(() =>
      instrLdrhImm.encodeInstruction([
        lowRegisterOption,
        validImmediateOptionHigh,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
  })
  test('LdrhRegisterOffsetInstruction', () => {
    // LDRH R1, [R2, R3]
    expect(
      instrLdrhReg
        .encodeInstruction([
          lowRegisterOption,
          lowRegisterOption2,
          lowRegisterOption3
        ])[0]
        .toBinaryString()
    ).toEqual('0101101011010001')
    // LDRH R1, [R2, #0x1F]
    expect(() =>
      instrLdrhReg.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        validImmediateOptionHigh
      ])
    ).toThrow(VirtualBoardError)
    // LDRH R1, [R2, SP]
    expect(() =>
      instrLdrhReg.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        highRegisterOption
      ])
    ).toThrow(VirtualBoardError)
    // LDRH R1, [R2, R22]
    expect(() =>
      instrLdrhReg.encodeInstruction([
        lowRegisterOption,
        lowRegisterOption2,
        invalidRegisterOption
      ])
    ).toThrow(VirtualBoardError)
    // LDRH R5, [R2
    expect(() =>
      instrLdrhReg.encodeInstruction([lowRegisterOption, lowRegisterOption2])
    ).toThrow(VirtualBoardError)
    // LDRH R5, 0x1F], [R2
    expect(() =>
      instrLdrhReg.encodeInstruction([
        lowRegisterOption,
        validImmediateOptionHigh,
        lowRegisterOption2
      ])
    ).toThrow(VirtualBoardError)
  })
})

describe('test executeInstruction function', () => {
  test('LDRH immediate offset', () => {
    // LDRH R7, [R6, #0x04] --> offset by 8
    memory.writeWord(registerValueR6.add(8), Word.fromUnsignedInteger(0x0009))
    instrLdrhImm.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1000100100110111)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
  test('LDRH register offset', () => {
    // LDRB R7, [R6, R5]
    memory.writeWord(
      registerValueR6.add(registerValueR5),
      Word.fromUnsignedInteger(0x0009)
    )
    instrLdrhReg.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101101101110111)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
})
