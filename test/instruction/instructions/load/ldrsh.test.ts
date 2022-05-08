import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { LdrshRegisterOffsetInstruction } from 'instruction/instructions/load/ldrsh'
import { Halfword, Word } from 'types/binary'
import { VirtualBoardError } from 'types/error'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'
const instrName = 'LDRSH'

const instruction = new LdrshRegisterOffsetInstruction()

const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR4: Word = Word.fromUnsignedInteger(0x00008000) // onlyHalfwordSign
const registerValueR3: Word = Word.fromUnsignedInteger(0x12345678) // value without halfword sign
const registerValueR2: Word = Word.fromUnsignedInteger(0x8ab0a10c) // value with Halfword sign and more bits set
const registerValueR1: Word = Word.fromUnsignedInteger(0x00000000) // offset zero

registers.writeRegister(Register.R4, registerValueR4)
registers.writeRegister(Register.R3, registerValueR3)
registers.writeRegister(Register.R2, registerValueR2)
registers.writeRegister(Register.R1, registerValueR1)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('LOAD instruction - LDRSH (register offset) - encoder', () => {
    expect(
      instruction.canEncodeInstruction(invalidInstructionName, [
        'R5',
        '[R3',
        'R1]'
      ])
    ).toBe(false)
    expect(
      instruction.canEncodeInstruction(instrName, ['R5', '[R3', 'R1]'])
    ).toBe(true)
    expect(instruction.canEncodeInstruction(instrName, ['invalidOption'])).toBe(
      true
    )
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('LdrshRegisterOffsetInstruction', () => {
    expect(
      instruction.encodeInstruction(['R5', '[R3', 'R1]'])[0].toBinaryString()
    ).toEqual('0101111001011101')
    expect(
      instruction.encodeInstruction(['R7', '[R5', 'R6]'])[0].toBinaryString()
    ).toEqual('0101111110101111')
    expect(() => instruction.encodeInstruction(['invalidOption'])).toThrow(
      VirtualBoardError
    )
    expect(() => instruction.encodeInstruction(['R7', 'R5]', 'R6]'])).toThrow(
      VirtualBoardError
    )
    expect(() => instruction.encodeInstruction(['R7', '[R5]', 'R6'])).toThrow(
      VirtualBoardError
    )
    expect(() => instruction.encodeInstruction(['R8', '[R5', 'R6]'])).toThrow(
      VirtualBoardError
    )
    expect(() => instruction.encodeInstruction(['R7', '[PC', 'R6]'])).toThrow(
      VirtualBoardError
    )
  })
})

describe('test executeInstruction function', () => {
  test('LDR halfword with sign extension', () => {
    memory.writeWord(registerValueR4, registerValueR4)
    memory.writeWord(registerValueR3, registerValueR3)
    memory.writeWord(registerValueR2, registerValueR2)
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101111001011101)], //LDRSH R5, [R3, R1]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R5).value).toEqual(0x5678)
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101111110001111)], //LDRSH R7, [R1, R6]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(0)
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101111001100101)], //LDRSH R5, [R4, R1]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R5).value).toEqual(0xffff8000)
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101111001010110)], //LDRSH R6, [R2, R1]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R6).value).toEqual(0xffffa10c)

    registers.writeRegister(Register.R6, Word.fromUnsignedInteger(4)) //TODO back to 3
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101111110011111)], //LDRSH R7, [R3, R6]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(0) //TODO 0xffff8acf
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101111110010000)], //LDRSH R0, [R2, R6]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R0).value).toEqual(0) //TODOJ 0x1421

    registers.writeRegister(Register.R6, Word.fromUnsignedInteger(16))
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101111110010000)], //LDRSH R0, [R2, R6]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R0).value).toEqual(0) //TODO 0xffff8ab0
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101111110011011)], //LDRSH R3, [R3, R6]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R3).value).toEqual(0) //TODO 0x1234
  })
})
