import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import {
  LdrhImmediate5OffsetInstruction,
  LdrhRegisterOffsetInstruction
} from 'instruction/instructions/load/ldrh'
import { Halfword, Word } from 'types/binary'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'

const invalidInstructionOptions = ['R77', '#2#']

const ldrName = 'LDR'
const ldrbName = 'LDRB'
const ldrhName = 'LDRH'

const ldrRegisterOptionsValid = ['R0', '[R1', 'R2]']
const ldrRegisterOptionsInvalid = ['R0', 'R1', 'R2']
const ldrRegisterOptionsInvalid2 = ['R0', 'R1]', '[R2']
const ldrLiteralOptionsValid = ['R0', '[R1', '#0xe6]']
const ldrLiteralOptionsValidShort = ['R5', '[R7]']
const ldrLiteralOptionsInvalid = ['R0', 'R1', '#0xe6']
const ldrLiteralOptionsInvalid2 = ['R0', 'R1]', '[#0xe6']

const instrLdrhImm = new LdrhImmediate5OffsetInstruction()
const instrLdrhReg = new LdrhRegisterOffsetInstruction()

const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR7: Word = Word.fromUnsignedInteger(0x00000000)
const registerValueR6: Word = Word.fromUnsignedInteger(0xabcdef01)
const registerValueR5: Word = Word.fromUnsignedInteger(0x00040000)

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
    ).toBe(true)
    expect(
      instrLdrhImm.canEncodeInstruction(ldrhName, ldrLiteralOptionsInvalid2)
    ).toBe(true)
    expect(
      instrLdrhImm.canEncodeInstruction(ldrhName, ldrLiteralOptionsValid)
    ).toBe(true)
    expect(
      instrLdrhImm.canEncodeInstruction(ldrhName, ldrLiteralOptionsValidShort)
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
    ).toBe(true)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrhName, ldrRegisterOptionsInvalid2)
    ).toBe(true)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrhName, ldrLiteralOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrhName, ldrLiteralOptionsInvalid2)
    ).toBe(false)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrhName, ldrRegisterOptionsValid)
    ).toBe(true)
    expect(
      instrLdrhReg.canEncodeInstruction(ldrhName, ldrLiteralOptionsValidShort)
    ).toBe(false)
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
      instrLdrhImm.encodeInstruction(['R4', '[R3]'])[0].toBinaryString()
    ).toEqual('1000100000011100')
    expect(
      instrLdrhImm.encodeInstruction(['R0', '[R4', '#0x1a]'])[0].toHexString()
    ).toEqual('8b60')
    expect(
      instrLdrhImm.encodeInstruction(['R7', '[R5', '#0x3e]'])[0].toHexString()
    ).toEqual('8fef')
    expect(() => instrLdrhImm.encodeInstruction(['R1', '[R6', 'R5]'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrhImm.encodeInstruction(['R5', '[R2'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrhImm.encodeInstruction(['R4', '[R3', '8]'])).toThrow(
      InstructionError
    )
    expect(() =>
      instrLdrhImm.encodeInstruction(['R5', '0x1F]', '[R2'])
    ).toThrow(InstructionError)
  })
  test('LdrhRegisterOffsetInstruction', () => {
    expect(
      instrLdrhReg.encodeInstruction(['R4', '[R7', 'R1]'])[0].toBinaryString()
    ).toEqual('0101101001111100')
    expect(() =>
      instrLdrhReg.encodeInstruction(['R4', '[R2', '#0x16]'])
    ).toThrow(InstructionError)
    expect(() => instrLdrhReg.encodeInstruction(['R1', '[R2', 'SP]'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrhReg.encodeInstruction(['R2', '[R55', 'R1]'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrhReg.encodeInstruction(['R5', '[R2'])).toThrow(
      InstructionError
    )
    expect(() =>
      instrLdrhReg.encodeInstruction(['R5', '0x1F]', '[R2'])
    ).toThrow(InstructionError)
    expect(() => instrLdrhReg.encodeInstruction(['R6', '[R2]'])).toThrow(
      InstructionError
    )
  })
})

describe('test executeInstruction function', () => {
  test('LDRH immediate offset', () => {
    // LDRH R7, [R6, #0x04] --> offset by 8
    memory.writeWord(registerValueR6.add(8), Word.fromUnsignedInteger(0x8209))
    instrLdrhImm.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1000100100110111)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(0x8209)
    // LDRH R3, [R5]
    memory.writeWord(registerValueR5, Word.fromUnsignedInteger(0xefe8))
    instrLdrhImm.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1000100000101011)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R3).value).toEqual(0xefe8)
    memory.reset()
  })
  test('LDRH register offset', () => {
    // LDRB R7, [R6, R5]
    memory.writeWord(
      registerValueR6.add(registerValueR5),
      Word.fromUnsignedInteger(0x7ed0)
    )
    instrLdrhReg.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101101101110111)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(0x7ed0)
    memory.reset()
  })
})
