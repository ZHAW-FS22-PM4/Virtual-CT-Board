import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { LdrsbRegisterOffsetInstruction } from 'instruction/instructions/load/ldrsb'
import { Byte, Halfword, Word } from 'types/binary'
import { VirtualBoardError } from 'types/error'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'
const instrName = 'LDRSB'

const instruction = new LdrsbRegisterOffsetInstruction()

const registers: Registers = new Registers()
const memory: Memory = new Memory()

const registerValueR4: Word = Word.fromUnsignedInteger(0x00000080) // onlyByteSign
const registerValueR3: Word = Word.fromUnsignedInteger(0x12345678) // value without byte sign
const registerValueR2: Word = Word.fromUnsignedInteger(0x8ab0a1bc) // value with byte sign and more bits set
const registerValueR1: Word = Word.fromUnsignedInteger(0x00000000) // offset zero

registers.writeRegister(Register.R4, registerValueR4)
registers.writeRegister(Register.R3, registerValueR3)
registers.writeRegister(Register.R2, registerValueR2)
registers.writeRegister(Register.R1, registerValueR1)

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('LOAD instruction - LDRSB (register offset) - encoder', () => {
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
  test('LdrsbRegisterOffsetInstruction', () => {
    expect(
      instruction.encodeInstruction(['R5', '[R3', 'R1]'])[0].toBinaryString()
    ).toEqual('0101011001011101')
    expect(
      instruction.encodeInstruction(['R7', '[R5', 'R6]'])[0].toBinaryString()
    ).toEqual('0101011110101111')
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
  test('LDR byte with sign extension', () => {
    memory.writeWord(registerValueR4, registerValueR4)
    memory.writeWord(registerValueR3, registerValueR3)
    memory.writeByte(registerValueR3.add(7), Byte.fromUnsignedInteger(0xb7)) //for offset 7
    memory.writeHalfword(
      registerValueR3.add(-220),
      Halfword.fromUnsignedInteger(0x8833)
    ) //for offset -220
    memory.writeHalfword(
      registerValueR3.add(68),
      Halfword.fromUnsignedInteger(0x6969)
    ) //for offset 68
    memory.writeWord(registerValueR2, registerValueR2)
    memory.writeByte(registerValueR2.add(7), Byte.fromUnsignedInteger(0x72)) //for offset 7
    memory.writeHalfword(
      registerValueR2.add(-220),
      Halfword.fromUnsignedInteger(0x22ee)
    ) //for offset -220
    memory.writeHalfword(
      registerValueR2.add(68),
      Halfword.fromUnsignedInteger(0xf4f5)
    ) //for offset 68
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101011001011101)], //LDRSB R5, [R3, R1]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R5).value).toEqual(0x78)
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101011110001111)], //LDRSB R7, [R1, R6]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(0)
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101011001100101)], //LDRSB R5, [R4, R1]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R5).value).toEqual(0xffffff80)
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101011001010110)], //LDRSB R6, [R2, R1]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R6).value).toEqual(0xffffffbc)

    registers.writeRegister(Register.R6, Word.fromUnsignedInteger(7))
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101011110011111)], //LDRSB R7, [R3, R6]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R7).value).toEqual(0xffffffb7)
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101011110010000)], //LDRSB R0, [R2, R6]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R0).value).toEqual(0x72)

    registers.writeRegister(Register.R5, Word.fromSignedInteger(-220))
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101011101010000)], //LDRSB R0, [R2, R5]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R0).value).toEqual(0xffffffee)
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101011101011001)], //LDRSB R1, [R3, R5]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R1).value).toEqual(0x33)

    registers.writeRegister(Register.R6, Word.fromUnsignedInteger(68))
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101011110010000)], //LDRSB R0, [R2, R6]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R0).value).toEqual(0xfffffff5)
    instruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0101011110011011)], //LDRSB R3, [R3, R6]
      registers,
      memory
    )
    expect(registers.readRegister(Register.R3).value).toEqual(0x69)
  })
})
