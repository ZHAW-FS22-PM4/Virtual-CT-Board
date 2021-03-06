import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import {
  LdrImmediate5OffsetInstruction,
  LdrRegisterInstruction,
  LdrRegisterOffsetInstruction
} from 'instruction/instructions/load/ldr'
import { Halfword, Word } from 'types/binary'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'

const invalidInstructionOptions = ['R77', '#2#']

const ldrName = 'LDR'
const ldrbName = 'LDRB'
const ldrhName = 'LDRH'

const ldrRegisterOptionsValid = ['R0', '[R1', 'R2]']
const ldrRegisterOptionsValidShort = ['R3', '[R4]']
const ldrRegisterOptionsInvalid = ['R0', 'R1', 'R2']
const ldrRegisterOptionsInvalid2 = ['R0', 'R1]', '[R2']
const ldrRegisterOptionsInvalidShort = ['R3', 'R4']
const ldrLiteralOptionsValid = ['R0', '[R1', '#0xe6]']
const ldrLiteralOptionsInvalid = ['R0', 'R1', '#0xe6']
const ldrLiteralOptionsInvalid2 = ['R0', 'R1]', '[#0xe6']
const ldrPCOptionsValid = ['R0', '[PC', '#0xe6]']
const ldrPCWithLiteralValid = ['R0', 'myliteral']
const ldrPCOptionsValid2 = ['R7', '[PC]']
const ldrOptionsWriteToPCInvalid = ['PC', '[R3', '#0x8]']

const instrLdrImm = new LdrImmediate5OffsetInstruction()
const instrLdrReg = new LdrRegisterOffsetInstruction()
const instrLdrPointer = new LdrRegisterInstruction()

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

const registerValueR7: Word = Word.fromUnsignedInteger(0x00000000)
const registerValueR6: Word = Word.fromUnsignedInteger(0x12345678)
const registerValueR5: Word = Word.fromUnsignedInteger(0x00000100)

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
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrRegisterOptionsInvalid)
    ).toBe(false)
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrRegisterOptionsInvalid2)
    ).toBe(false)
    expect(instrLdrImm.canEncodeInstruction(ldrName, ldrPCOptionsValid)).toBe(
      false
    )
    expect(instrLdrImm.canEncodeInstruction(ldrName, ldrPCOptionsValid2)).toBe(
      false
    )
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrPCWithLiteralValid)
    ).toBe(false)
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
    expect(
      instrLdrImm.canEncodeInstruction(ldrName, ldrRegisterOptionsInvalidShort)
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
    ).toBe(true)
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrRegisterOptionsInvalid2)
    ).toBe(true)
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
    expect(instrLdrReg.canEncodeInstruction(ldrName, ldrPCOptionsValid)).toBe(
      false
    )
    expect(instrLdrReg.canEncodeInstruction(ldrName, ldrPCOptionsValid2)).toBe(
      false
    )
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrPCWithLiteralValid)
    ).toBe(false)
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrRegisterOptionsValid)
    ).toBe(true)
    expect(
      instrLdrReg.canEncodeInstruction(ldrName, ldrRegisterOptionsInvalidShort)
    ).toBe(false)
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
      instrLdrPointer.canEncodeInstruction(ldrName, ldrLiteralOptionsInvalid2)
    ).toBe(false)
    expect(
      instrLdrPointer.canEncodeInstruction(ldrName, ldrPCOptionsValid2)
    ).toBe(true)
    expect(
      instrLdrPointer.canEncodeInstruction(ldrName, ldrPCWithLiteralValid)
    ).toBe(true)
    expect(
      instrLdrPointer.canEncodeInstruction(
        ldrName,
        ldrRegisterOptionsInvalidShort
      )
    ).toBe(false)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('LdrImmediate5OffsetInstruction', () => {
    expect(
      instrLdrImm.encodeInstruction(['R7', '[R2', '#0x28]'])[0].toBinaryString()
    ).toEqual('0110101010010111')
    expect(
      instrLdrImm.encodeInstruction(['R1', '[R2', '#0x7C]'])[0].toBinaryString()
    ).toEqual('0110111111010001')
    expect(
      instrLdrImm.encodeInstruction(['R3', '[R6]'])[0].toBinaryString()
    ).toEqual('0110100000110011')
    expect(
      instrLdrImm.encodeInstruction(['R2', '[R3', '#0x1C]'])[0].toHexString()
    ).toEqual('69da')
    expect(
      instrLdrImm.encodeInstruction(['R1', '[R5', '#0x20]'])[0].toHexString()
    ).toEqual('6a29')
    expect(
      instrLdrImm.encodeInstruction(['R6', '[R7', '#0x7C]'])[0].toHexString()
    ).toEqual('6ffe')
    expect(() => instrLdrImm.encodeInstruction(['R7', '[R2', 'R3]'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrImm.encodeInstruction(['R5', '[R2'])).toThrow(
      encodingErrorWrongBracketsOn2nd
    )
    expect(() => instrLdrImm.encodeInstruction(['R1', '[R2', '#5'])).toThrow(
      encodingErrorWrongBracketsOn2ndOr3rd
    )
    expect(() => instrLdrImm.encodeInstruction(['R5', '0x1F]', '[R2'])).toThrow(
      encodingErrorWrongBracketsOn2ndOr3rd
    )
    expect(() => instrLdrImm.encodeInstruction(['R1', '[R2', '#0x3]'])).toThrow(
      offsetNotWordAligned
    )
    expect(() => instrLdrImm.encodeInstruction(['R1', '[R2', '#0x2]'])).toThrow(
      offsetNotWordAligned
    )
  })
  test('LdrRegisterOffsetInstruction', () => {
    expect(
      instrLdrReg.encodeInstruction(['R4', '[R2', 'R3]'])[0].toBinaryString()
    ).toEqual('0101100011010100')
    expect(
      instrLdrReg.encodeInstruction(['R0', '[R2', 'R5]'])[0].toBinaryString()
    ).toEqual('0101100101010000')
    expect(() =>
      instrLdrReg.encodeInstruction(['R1', '[R2', '#0x1F]'])
    ).toThrow(InstructionError)
    expect(() => instrLdrReg.encodeInstruction(['R1', '[R2', 'SP]'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrReg.encodeInstruction(['R1', '[R2', 'R22]'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrReg.encodeInstruction(['R1', '[R2'])).toThrow(
      InstructionError
    )
    expect(() =>
      instrLdrReg.encodeInstruction(['R1', '#0x1F]', '[R2'])
    ).toThrow(InstructionError)
  })
  test('LoadRegisterInstruction', () => {
    expect(
      instrLdrPointer
        .encodeInstruction(['R1', '[PC', '#0x03]'])[0] //VCB-176 --> offset '#0x0c]'
        .toBinaryString()
    ).toEqual('0100100100000011')
    expect(
      instrLdrPointer
        .encodeInstruction(['R1', '[PC', '#0x1f]'])[0] //VCB-176 --> offset '#0x7c]'
        .toBinaryString()
    ).toEqual('0100100100011111')
    expect(
      instrLdrPointer.encodeInstruction(['R2', '[PC]'])[0].toBinaryString()
    ).toEqual('0100101000000000')
    expect(
      instrLdrPointer
        .encodeInstruction(['R0', '[PC', '#0]'])[0]
        .toBinaryString()
    ).toEqual('0100100000000000')
    expect(
      instrLdrPointer
        .encodeInstruction(['R5', '[PC', '#0x000]'])[0]
        .toBinaryString()
    ).toEqual('0100110100000000')
    expect(() =>
      instrLdrPointer.encodeInstruction(['R1', '[R2', 'R3]'])
    ).toThrow(InstructionError)
    expect(() =>
      instrLdrPointer.encodeInstruction(['R1', '[SP', '#4]'])
    ).toThrow(new InstructionError('Second param is not PC register'))
    expect(() => instrLdrPointer.encodeInstruction(['R1', '[R2'])).toThrow(
      InstructionError
    )
    expect(() => instrLdrPointer.encodeInstruction(['R1', '[R2', '5'])).toThrow(
      InstructionError
    )
    expect(() =>
      instrLdrPointer.encodeInstruction(['R5', '#0x1F]', '[R2'])
    ).toThrow(InstructionError)
    //VCB-176 --> uncomment tests
    /*expect(() =>
      instrLdrPointer.encodeInstruction(['R1', '[PC', '#0x6]'])
    ).toThrow(offsetNotWordAligned)
    expect(() =>
      instrLdrPointer.encodeInstruction(['R1', '[PC', '#0x7]'])
    ).toThrow(offsetNotWordAligned)*/
  })

  test('LoadRegisterInstruction - pseudo instruction', () => {
    expect(
      instrLdrPointer.encodeInstruction(['R3', '=justSmth'])[0].toBinaryString()
    ).toEqual('0100101100000000')
    expect(
      instrLdrPointer.encodeInstruction(['R4', 'mylita'])[0].toBinaryString()
    ).toEqual('0100110000000000')
    expect(
      instrLdrPointer
        .encodeInstruction(['R3', '=0x20003000'])[0]
        .toBinaryString()
    ).toEqual('0100101100000000')
    expect(
      instrLdrPointer
        .encodeInstruction(['R3', '=justSmth'], {
          justSmth: Word.fromUnsignedInteger(0x68) //VCB-176 --> 0x1a0
        })[0]
        .toBinaryString()
    ).toEqual('0100101101101000')
    expect(
      instrLdrPointer
        .encodeInstruction(['R6', '=everything'], {
          everything: Word.fromSignedInteger(-3) //VCB-176 --> -12
        })[0]
        .toBinaryString()
    ).toEqual('0100111011111101')
    expect(
      instrLdrPointer
        .encodeInstruction(['R3', '=0x20003000'], {
          '0x20003000': Word.fromUnsignedInteger(0x11) //VCB-176 --> 0x44
        })[0]
        .toBinaryString()
    ).toEqual('0100101100010001')
    expect(
      instrLdrPointer
        .encodeInstruction(['R4', 'myLita'], {
          myLita: Word.fromUnsignedInteger(0x80) //VCB-176 --> 0x200
        })[0]
        .toBinaryString()
    ).toEqual('0100110010000000')
  })
})

describe('test executeInstruction function', () => {
  test('LdrImmediate5OffsetInstruction - LDR word immediate offset', () => {
    // LDR R7, [R6, #0x14]
    memory.writeWord(
      registerValueR6.add(0x14),
      Word.fromUnsignedInteger(0x0009)
    )
    instrLdrImm.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0110100101110111)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    // LDR R4, [R5]
    memory.writeWord(registerValueR5, Word.fromUnsignedInteger(0x8451e6d9))
    instrLdrImm.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0110100000101100)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R4).value).toEqual(0x8451e6d9)
    memory.reset()
  })
  test('LdrRegisterOffsetInstruction - LDR word register offset', () => {
    // LDR R7, [R6, R5]
    memory.writeWord(
      registerValueR6.add(registerValueR5.value),
      Word.fromUnsignedInteger(0x0009)
    )
    instrLdrReg.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101100101110111)],
      registers,
      memory
    )
    expect(
      memory.readWord(registerValueR6.add(registerValueR5.value)).value
    ).toEqual(9)
    expect(registers.readRegister(Register.R7).value).toEqual(9)
    memory.reset()
  })
  test('LdrRegisterInstruction - LDR word pc offset', () => {
    const pcAddress = Word.fromUnsignedInteger(0x08123456c)
    registers.writeRegister(Register.PC, pcAddress)
    memory.writeWord(pcAddress, Word.fromUnsignedInteger(0x12345678))
    memory.writeWord(pcAddress.add(4), Word.fromUnsignedInteger(0x9abcdeff))

    //LDR R3, [PC]
    instrLdrPointer.executeInstruction(
      [Halfword.fromUnsignedInteger(0x4b00)],
      registers,
      memory
    )
    expect(memory.readWord(pcAddress).value).toEqual(0x12345678)
    expect(registers.readRegister(Register.R3).value).toEqual(0x12345678)
    //LDR R4, [PC, #4]
    instrLdrPointer.executeInstruction(
      [Halfword.fromUnsignedInteger(0x4c04)], //VCB-176 --> 0x4c01
      registers,
      memory
    )
    expect(memory.readWord(pcAddress.add(4)).value).toEqual(0x9abcdeff)
    expect(registers.readRegister(Register.R4).value).toEqual(0x9abcdeff)
    memory.reset()
  })
})
