import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import {
  LdrbImmediate5OffsetInstruction,
  LdrbRegisterOffsetInstruction
} from 'instruction/instructions/load/ldrb'
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
const ldrLiteralOptionsValidShort = ['R6', '[R4]']
const ldrLiteralOptionsInvalid = ['R0', 'R1', '#0xe6']
const ldrLiteralOptionsInvalid2 = ['R0', 'R1]', '[#0xe6']

const instrLdrbImm = new LdrbImmediate5OffsetInstruction()
const instrLdrbReg = new LdrbRegisterOffsetInstruction()

const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR7: Word = Word.fromUnsignedInteger(0x00000000)
const registerValueR6: Word = Word.fromUnsignedInteger(0x1f2e3d4c)
const registerValueR5: Word = Word.fromUnsignedInteger(0x08010100)

registers.writeRegister(Register.R7, registerValueR7)
registers.writeRegister(Register.R6, registerValueR6)
registers.writeRegister(Register.R5, registerValueR5)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('LOAD instruction - LDRB (immediate offset) - byte encoder', () => {
    expect(
      instrLdrbImm.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instrLdrbImm.canEncodeInstruction(ldrName, ldrLiteralOptionsValid)
    ).toBe(false)
    expect(
      instrLdrbImm.canEncodeInstruction(ldrhName, ldrLiteralOptionsValid)
    ).toBe(false)
    expect(
      instrLdrbImm.canEncodeInstruction(ldrbName, ldrRegisterOptionsValid)
    ).toBe(false)
    expect(
      instrLdrbImm.canEncodeInstruction(ldrhName, ldrRegisterOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrbImm.canEncodeInstruction(ldrhName, ldrRegisterOptionsInvalid2)
    ).toBe(false)
    expect(
      instrLdrbImm.canEncodeInstruction(ldrbName, ldrLiteralOptionsInvalid)
    ).toBe(true)
    expect(
      instrLdrbImm.canEncodeInstruction(ldrbName, ldrLiteralOptionsInvalid2)
    ).toBe(true)
    expect(
      instrLdrbImm.canEncodeInstruction(ldrbName, ldrLiteralOptionsValid)
    ).toBe(true)
    expect(
      instrLdrbImm.canEncodeInstruction(ldrbName, ldrLiteralOptionsValidShort)
    ).toBe(true)
  })
  test('LOAD instruction - LDRB (register offset) - byte encoder', () => {
    expect(
      instrLdrbReg.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instrLdrbReg.canEncodeInstruction(ldrName, ldrRegisterOptionsValid)
    ).toBe(false)
    expect(
      instrLdrbReg.canEncodeInstruction(ldrhName, ldrRegisterOptionsValid)
    ).toBe(false)
    expect(
      instrLdrbReg.canEncodeInstruction(ldrbName, ldrLiteralOptionsValid)
    ).toBe(false)
    expect(
      instrLdrbReg.canEncodeInstruction(ldrbName, ldrRegisterOptionsInvalid)
    ).toBe(true)
    expect(
      instrLdrbReg.canEncodeInstruction(ldrbName, ldrRegisterOptionsInvalid2)
    ).toBe(true)
    expect(
      instrLdrbReg.canEncodeInstruction(ldrbName, ldrLiteralOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrbReg.canEncodeInstruction(ldrbName, ldrRegisterOptionsValid)
    ).toBe(true)
    expect(
      instrLdrbReg.canEncodeInstruction(ldrbName, ldrLiteralOptionsValidShort)
    ).toBe(false)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('LdrbImmediate5OffsetInstruction', () => {
    expect(
      instrLdrbImm.encodeInstruction(['R1', '[R2', '#0x1]'])[0].toBinaryString()
    ).toEqual('0111100001010001')
    expect(
      instrLdrbImm
        .encodeInstruction(['R1', '[R2', '#0x1F]'])[0]
        .toBinaryString()
    ).toEqual('0111111111010001')
    expect(
      instrLdrbImm.encodeInstruction(['R7', '[R4]'])[0].toBinaryString()
    ).toEqual('0111100000100111')
    expect(() => instrLdrbImm.encodeInstruction(['R1', '[R2', 'R3]'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrbImm.encodeInstruction(['R1', '[R2'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrbImm.encodeInstruction(['R1', '[R2', '6]'])).toThrow(
      InstructionError
    )
    expect(() =>
      instrLdrbImm.encodeInstruction(['R1', '0x19]', '[R2'])
    ).toThrow(InstructionError)
  })
  test('LdrbRegisterOffsetInstruction', () => {
    expect(
      instrLdrbReg.encodeInstruction(['R1', '[R2', 'R3]'])[0].toBinaryString()
    ).toEqual('0101110011010001')
    expect(() =>
      instrLdrbReg.encodeInstruction(['R1', '[R2', '#0x1F]'])
    ).toThrow(InstructionError)
    expect(() => instrLdrbReg.encodeInstruction(['R1', '[R2', 'R8]'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrbReg.encodeInstruction(['R11', '[R2', 'R5]'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrbReg.encodeInstruction(['R1', '[R2'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrbReg.encodeInstruction(['R1', '0xd]', '[R2'])).toThrow(
      InstructionError
    )
  })
})

describe('test executeInstruction function', () => {
  test('LDRB immediate offset', () => {
    // LDRB R7, [R6, #0x1c]
    memory.writeWord(registerValueR6.add(0x1c), Word.fromUnsignedInteger(0xd3))
    instrLdrbImm.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0111111100110111)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(0xd3)
    // LDRB R2, [R5]
    memory.writeWord(registerValueR5, Word.fromUnsignedInteger(0x70))
    instrLdrbImm.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0111100000101010)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R2).value).toEqual(0x70)
    memory.reset()
  })
  test('LDRB register offset', () => {
    // LDRB R7, [R6, R5]
    memory.writeWord(
      registerValueR6.add(registerValueR5),
      Word.fromUnsignedInteger(0x0009)
    )
    instrLdrbReg.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101110101110111)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
})
