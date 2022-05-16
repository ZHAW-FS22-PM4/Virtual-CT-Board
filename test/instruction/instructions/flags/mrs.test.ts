import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import { MrsInstruction } from 'instruction/instructions/flags/mrs'

const registers = new Registers()
const memory = new Memory()

const mrsInstruction = new MrsInstruction()
const flagsAllZero = {
  [Flag.N]: false,
  [Flag.Z]: false,
  [Flag.C]: false,
  [Flag.V]: false
}
const flagsAllOne = {
  [Flag.N]: true,
  [Flag.Z]: true,
  [Flag.C]: true,
  [Flag.V]: true
}

const flagsOneZero = {
  [Flag.N]: true,
  [Flag.Z]: false,
  [Flag.C]: true,
  [Flag.V]: false
}

describe('test encodeInstruction function for MRS', () => {
  it('should create correct opcode for MRS R0, APSR', () => {
    let opcode = mrsInstruction.encodeInstruction(['R0', 'APSR'])
    expect(opcode[0].toBinaryString()).toEqual('1111001111101111')
    expect(opcode[1].toBinaryString()).toEqual('1000000000000000')
  })
  it('should create correct opcode for MRS R12, APSR', () => {
    let opcode = mrsInstruction.encodeInstruction(['R12', 'APSR'])
    expect(opcode[0].toBinaryString()).toEqual('1111001111101111')
    expect(opcode[1].toBinaryString()).toEqual('1000110000000000')
  })
  it('should throw an error for MRS R0, R1 because 2nd param cannot be a register', () => {
    expect(() => mrsInstruction.encodeInstruction(['R0', 'R1'])).toThrow()
  })
  it('should throw an error for MRS R0, APS because 2nd param cannot be anything but APSR', () => {
    expect(() => mrsInstruction.encodeInstruction(['R1', 'APS'])).toThrow()
  })
})

describe('test executeInstruction function for MRS', () => {
  it('should correctly execute MRS R0, APSR with flags all set to 0', () => {
    registers.setFlags(flagsAllZero)
    let opcode = mrsInstruction.encodeInstruction(['R0', 'APSR'])
    mrsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R0).value).toEqual(0x00)
  })
  it('should correctly execute MRS R0, APSR with flags all set to 1', () => {
    registers.setFlags(flagsAllOne)
    let opcode = mrsInstruction.encodeInstruction(['R0', 'APSR'])
    mrsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R0).value).toEqual(0xf0000000)
  })
  it('should correctly execute MRS R0, APSR with mixed flags (1010)', () => {
    registers.setFlags(flagsOneZero)
    let opcode = mrsInstruction.encodeInstruction(['R0', 'APSR'])
    mrsInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R0).value).toEqual(0xa0000000)
  })
})
