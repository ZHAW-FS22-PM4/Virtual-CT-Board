import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import { PopInstruction } from 'instruction/instructions/stack/pop'
import { PushInstruction } from 'instruction/instructions/stack/push'
import { Halfword, Word } from 'types/binary'

const instr = new PopInstruction()

const registers: Registers = new Registers()
const memory: Memory = new Memory()

describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('POP instruction', () => {
    expect(instr.canEncodeInstruction('INVALID', ['{R2', 'R7}'])).toBe(false)
    expect(instr.canEncodeInstruction('POP', ['[R2', 'R7]'])).toBe(true)
    expect(instr.canEncodeInstruction('POP', ['R2}', '{R7}'])).toBe(true)
    expect(instr.canEncodeInstruction('POP', ['{R2', 'R7'])).toBe(true)
    expect(instr.canEncodeInstruction('POP', ['{R2', 'R7 }'])).toBe(true)
    expect(instr.canEncodeInstruction('POP', ['{R5', 'R5}'])).toBe(true)
    expect(instr.canEncodeInstruction('POP', ['{R2', 'PC', 'R7}'])).toBe(true)
    expect(instr.canEncodeInstruction('POP', ['{R2 -R6}'])).toBe(true)
    expect(instr.canEncodeInstruction('POP', ['{R3-R1}'])).toBe(true)
    expect(instr.canEncodeInstruction('POP', ['{R2- R6', 'R0}'])).toBe(true)
    expect(instr.canEncodeInstruction('POP', ['{ PC}'])).toBe(true)
    expect(instr.canEncodeInstruction('POP', ['{LR}'])).toBe(true)
    expect(
      instr.canEncodeInstruction('POP', [
        '{R5',
        'PC',
        'R1',
        'R7',
        'R6',
        'R0',
        'R3',
        'R2',
        'R4}'
      ])
    ).toBe(true)
  })
})

describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('POP', () => {
    expect(instr.encodeInstruction(['{R2', 'R7}'])[0].toBinaryString()).toEqual(
      '1011110010000100'
    )
    expect(instr.encodeInstruction(['{R5', 'R1}'])[0].toBinaryString()).toEqual(
      '1011110000100010'
    )
    expect(
      instr.encodeInstruction(['{ PC', 'R7}'])[0].toBinaryString()
    ).toEqual('1011110110000000')
    expect(instr.encodeInstruction(['{R0', 'PC}'])[0].toBinaryString()).toEqual(
      '1011110100000001'
    )
    expect(
      instr.encodeInstruction(['{  R3-R6', 'R0-R1}'])[0].toBinaryString()
    ).toEqual('1011110001111011')
    expect(
      instr.encodeInstruction(['{R2', 'R4', 'R6 }'])[0].toBinaryString()
    ).toEqual('1011110001010100')
    expect(
      instr.encodeInstruction(['{R3', 'PC', 'R7', 'R5}'])[0].toBinaryString()
    ).toEqual('1011110110101000')
    expect(instr.encodeInstruction(['{R2 -R6}'])[0].toBinaryString()).toEqual(
      '1011110001111100'
    )
    expect(instr.encodeInstruction(['{R0-R7}'])[0].toBinaryString()).toEqual(
      '1011110011111111'
    )
    expect(
      instr.encodeInstruction(['{R3- R3', 'R0}'])[0].toBinaryString()
    ).toEqual('1011110000001001')
    expect(instr.encodeInstruction(['{PC}'])[0].toBinaryString()).toEqual(
      '1011110100000000'
    )
    expect(
      instr
        .encodeInstruction([
          '{R5',
          'PC',
          'R1',
          'R7',
          'R6',
          'R0',
          'R3',
          'R2',
          'R4}'
        ])[0]
        .toBinaryString()
    ).toEqual('1011110111111111')

    expect(() => instr.encodeInstruction(['invalidOption'])).toThrow(
      InstructionError
    )
    expect(() => instr.encodeInstruction(['[R7', 'R5]'])).toThrow(
      InstructionError
    )
    expect(() => instr.encodeInstruction(['R2}', '{R7}'])).toThrow(
      InstructionError
    )
    expect(() => instr.encodeInstruction([])).toThrow(InstructionError)
    expect(() => instr.encodeInstruction(['{R2', 'R7'])).toThrow(
      InstructionError
    )
    expect(() => instr.encodeInstruction(['{R5', 'R5}'])).toThrow(
      InstructionError
    )
    expect(() => instr.encodeInstruction(['{LR}'])).toThrow(InstructionError)
    expect(() => instr.encodeInstruction(['{R6-R3}'])).toThrow(InstructionError)
    expect(() => instr.encodeInstruction(['{R8}'])).toThrow(InstructionError)
    expect(() => instr.encodeInstruction(['{R77}'])).toThrow(InstructionError)
  })
})

describe('test executeInstruction function', () => {
  test('POP with PUSH before of other registers', () => {
    let pushInstr = new PushInstruction()

    let stackAddress = Word.fromUnsignedInteger(0x20004324)
    const value1 = Word.fromUnsignedInteger(0x66ee44bb)
    const value2 = Word.fromUnsignedInteger(0xe17c2ab6)
    registers.writeRegister(Register.SP, stackAddress)
    registers.writeRegister(Register.R1, value1)
    registers.writeRegister(Register.R5, value2)

    pushInstr.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1011010000100010)], //PUSH {R1, R5}
      registers,
      memory
    )

    registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0))
    registers.writeRegister(Register.R5, Word.fromUnsignedInteger(0))

    instr.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1011110000100010)], //POP {R1, R5}
      registers,
      memory
    )

    expect(registers.readRegister(Register.R1)).toEqual(value1)
    expect(registers.readRegister(Register.R5)).toEqual(value2)
  })
  test('POP with directly writing to stack memory', () => {
    let stackAddress = Word.fromUnsignedInteger(0x2000199c)
    const topOfStackVal = Word.fromUnsignedInteger(0xfedc4321)
    const stackVal2 = Word.fromUnsignedInteger(0x22443355)
    const stackVal3 = Word.fromUnsignedInteger(0x03050208)
    const stackVal4 = Word.fromUnsignedInteger(0xe05011c0)
    const stackVal5 = Word.fromUnsignedInteger(0x57382548)
    const stackVal6 = Word.fromUnsignedInteger(0x03002405)
    registers.writeRegister(Register.SP, stackAddress)
    memory.writeWord(stackAddress, topOfStackVal)
    memory.writeWord(stackAddress.add(4), stackVal2)
    memory.writeWord(stackAddress.add(8), stackVal3)
    memory.writeWord(stackAddress.add(12), stackVal4)
    memory.writeWord(stackAddress.add(16), stackVal5)
    memory.writeWord(stackAddress.add(20), stackVal6)

    instr.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1011110000100010)], //POP {R1, R5}
      registers,
      memory
    )

    expect(memory.readByte(stackAddress).value).toBe(0x21)
    expect(registers.readRegister(Register.R1)).toEqual(topOfStackVal)
    expect(registers.readRegister(Register.R5)).toEqual(stackVal2)
    expect(registers.readRegister(Register.SP).value).toEqual(
      stackAddress.add(8).value
    )

    instr.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1011110110101000)], //POP {R3, PC, R7, R5}
      registers,
      memory
    )

    expect(registers.readRegister(Register.R3)).toEqual(stackVal3)
    expect(registers.readRegister(Register.R5)).toEqual(stackVal4)
    expect(registers.readRegister(Register.R7)).toEqual(stackVal5)
    expect(registers.readRegister(Register.PC)).toEqual(stackVal6)

    expect(registers.readRegister(Register.SP).value).toEqual(
      stackAddress.add(24).value
    )

    registers.reset()
    registers.writeRegister(Register.SP, stackAddress)

    instr.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1011110100000000)], //POP {PC}
      registers,
      memory
    )

    expect(registers.readRegister(Register.PC)).toEqual(topOfStackVal)
    expect(registers.readRegister(Register.R7).value).toEqual(0)
    expect(registers.readRegister(Register.R0).value).toEqual(0)
    expect(registers.readRegister(Register.SP).value).toEqual(
      stackAddress.add(4).value
    )
    expect(registers.readRegister(Register.PC)).toEqual(topOfStackVal) //uchanged

    instr.executeInstruction(
      [Halfword.fromUnsignedInteger(0b1011110001000111)], //POP {R6, R0-R2}
      registers,
      memory
    )

    expect(registers.readRegister(Register.PC)).toEqual(topOfStackVal) //uchanged
    expect(registers.readRegister(Register.R0)).toEqual(stackVal2)
    expect(registers.readRegister(Register.R1)).toEqual(stackVal3)
    expect(registers.readRegister(Register.R2)).toEqual(stackVal4)
    expect(registers.readRegister(Register.R6)).toEqual(stackVal5)
    expect(registers.readRegister(Register.SP).value).toEqual(
      stackAddress.add(20).value
    )
  })
})
