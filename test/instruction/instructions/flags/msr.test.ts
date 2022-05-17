import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import { MrsInstruction } from 'instruction/instructions/flags/mrs'
import { MsrInstruction } from 'instruction/instructions/flags/msr'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

const msrInstruction = new MsrInstruction()
const mrsInstruction = new MrsInstruction()

beforeEach(function () {
  registers.reset()
  registers.writeRegister(Register.R0, Word.fromUnsignedInteger(0xf0000000))
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0x00000000))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0xa0000000))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0x50000000))
  registers.writeRegister(Register.R4, Word.fromUnsignedInteger(0x80000000))
  registers.writeRegister(Register.R5, Word.fromUnsignedInteger(0x00000001))
  registers.writeRegister(Register.R6, Word.fromUnsignedInteger(0x0fffffff))
})

describe('test encodeInstruction function for MSR', () => {
  it('should create correct opcode for MSR APSR, R0', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R0'])
    expect(opcode[0].toBinaryString()).toEqual('1111001110000000')
    expect(opcode[1].toBinaryString()).toEqual('1000100000000000')
  })
  it('should create correct opcode for MRS R12, APSR', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R12'])
    expect(opcode[0].toBinaryString()).toEqual('1111001110001100')
    expect(opcode[1].toBinaryString()).toEqual('1000100000000000')
  })
  it('should throw an error for MSR R0, R1 because 1st param cannot be a register', () => {
    expect(() => msrInstruction.encodeInstruction(['R0', 'R1'])).toThrow()
  })
  it('should throw an error for MRS APS, R0 because 1st param cannot be anything but APSR', () => {
    expect(() => msrInstruction.encodeInstruction(['APS', 'R0'])).toThrow()
  })
})

describe('test executeInstruction function for MSR', () => {
  it('should correctly execute MSR APSR, R0 with R0 = F0000000 (all flags set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R0'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.APSR).value).toEqual(0xf0000000)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy
    expect(registers.isFlagSet(Flag.C)).toBeTruthy
    expect(registers.isFlagSet(Flag.V)).toBeTruthy
  })
  it('should correctly execute MSR APSR, R0 with R1 = 0x00 (no flag set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R1'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.APSR).value).toEqual(0)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy
    expect(registers.isFlagSet(Flag.C)).toBeFalsy
    expect(registers.isFlagSet(Flag.V)).toBeFalsy
  })
  it('should correctly execute MSR APSR, R0 with R2 = 0xA0000000 (2 flags set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R2'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.APSR).value).toEqual(0xa0000000)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy
    expect(registers.isFlagSet(Flag.C)).toBeTruthy
    expect(registers.isFlagSet(Flag.V)).toBeFalsy
  })
  it('should correctly execute MSR APSR, R0 with R3 = 0x50000000 (2 flags set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R3'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.APSR).value).toEqual(0x50000000)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy
    expect(registers.isFlagSet(Flag.C)).toBeFalsy
    expect(registers.isFlagSet(Flag.V)).toBeTruthy
  })
  it('should correctly execute MSR APSR, R0 with R4 = 0x80000000 (N flag set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R4'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.APSR).value).toEqual(0x80000000)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy
    expect(registers.isFlagSet(Flag.C)).toBeFalsy
    expect(registers.isFlagSet(Flag.V)).toBeFalsy
  })
  it('should correctly execute MSR APSR, R0 with R5 = 0x01 (no flag set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R5'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.APSR).value).toEqual(0)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy
    expect(registers.isFlagSet(Flag.C)).toBeFalsy
    expect(registers.isFlagSet(Flag.V)).toBeFalsy
  })
  it('should correctly execute MSR APSR, R0 with R6 = 0x0FFFFFFF (no flag set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R6'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.APSR).value).toEqual(0)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy
    expect(registers.isFlagSet(Flag.C)).toBeFalsy
    expect(registers.isFlagSet(Flag.V)).toBeFalsy
  })
})
