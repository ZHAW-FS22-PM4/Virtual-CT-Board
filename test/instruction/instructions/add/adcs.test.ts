import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import { AdcsInstruction } from 'instruction/instructions/add/adcs'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const adcsInstruction = new AdcsInstruction()

beforeEach(function () {
  registers.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0x01))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x00))
})

describe('test encodeInstruction function for ADCS', () => {
  it('should create correct opcode for ADCS R1, R3', () => {
    let opcode = adcsInstruction.encodeInstruction(['R1', 'R3'])
    expect(opcode[0].toBinaryString()).toEqual('0100000101011001')
  })

  it('should create correct opcode for ADCS R1, R1, R3', () => {
    let opcode = adcsInstruction.encodeInstruction(['R1', 'R1', 'R3'])
    expect(opcode[0].toBinaryString()).toEqual('0100000101011001')
  })

  it('should throw an error for different params 0 and 1', () => {
    let registerArray = ['R1', 'R2', 'R3']
    expect(() => adcsInstruction.encodeInstruction(registerArray)).toThrow()
  })

  it('should throw an error for high registers', () => {
    expect(() => adcsInstruction.encodeInstruction(['R1', 'R8'])).toThrow()
  })
})

describe('test executeInstruction function for ADCS', () => {
  it('should return correct result for addition with carry set', () => {
    registers.setFlag(Flag.C, true)
    let adcsOpcode = adcsInstruction.encodeInstruction(['R1', 'R2'])
    adcsInstruction.executeInstruction(adcsOpcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x02)
  })

  it('should return correct result for addition without carry set', () => {
    registers.setFlag(Flag.C, false)
    let adcsOpcode = adcsInstruction.encodeInstruction(['R1', 'R2'])
    adcsInstruction.executeInstruction(adcsOpcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toEqual(0x01)
  })
})
