import { Word } from 'types/binary'
import { Register, Registers } from 'board/registers'
import { Memory } from 'board/memory'
import { AdcsInstruction } from 'instruction/instructions/adcs'
import { AddsRegistersInstruction } from 'instruction/instructions/add'

const registers = new Registers()
const memory = new Memory()

const adcsInstruction = new AdcsInstruction()
const addsInstruction = new AddsRegistersInstruction()

beforeEach(function () {
  registers.clear()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0xffffffff))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x01))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0x01))
  registers.writeRegister(Register.R4, Word.fromUnsignedInteger(0x00))
})

describe('test encodeInstruction function for ADCS', () => {
  it('should create correct opcode for ADCS R1, R3', () => {
    let opcode = adcsInstruction.encodeInstruction(['R1', 'R3'], {})
    expect(opcode.toBinaryString()).toEqual('0100000101011001')
  })

  it('should create correct opcode for ADCS R1, R1, R3', () => {
    let opcode = adcsInstruction.encodeInstruction(['R1', 'R1', 'R3'], {})
    expect(opcode.toBinaryString()).toEqual('0100000101011001')
  })

  it('should throw an error for different params 0 and 1', () => {
    let registerArray = ['R1', 'R2', 'R3']
    expect(() => adcsInstruction.encodeInstruction(registerArray, {})).toThrow()
  })

  it('should throw an error for high registers', () => {
    expect(() => adcsInstruction.encodeInstruction(['R1', 'R8'], {})).toThrow()
  })
})

describe('test executeInstruction function for ADCS', () => {
  it('should return correct result from registers for ADDS R1, R3; ADCS R2, R4', () => {
    let addsOpcode = addsInstruction.encodeInstruction(['R1', 'R3'], {})
    let adcsOpcode = adcsInstruction.encodeInstruction(['R2', 'R4'], {})
    addsInstruction.executeInstruction(addsOpcode, registers, memory)
    adcsInstruction.executeInstruction(adcsOpcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x00)
    expect(registers.readRegister(Register.R2).value).toEqual(0x02)
  })
})
