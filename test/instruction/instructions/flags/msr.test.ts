import { Memory } from 'board/memory'
import { Flag, Registers } from 'board/registers'
import { MsrInstruction } from 'instruction/instructions/flags/msr'

const registers = new Registers()
const memory = new Memory()

const msrInstruction = new MsrInstruction()

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
    expect(registers.isFlagSet(Flag.N)).toBeTruthy
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy
    expect(registers.isFlagSet(Flag.C)).toBeTruthy
    expect(registers.isFlagSet(Flag.V)).toBeTruthy
  })
  it('should correctly execute MSR APSR, R0 with R0 = 0x00 (no flag set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R0'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy
    expect(registers.isFlagSet(Flag.C)).toBeFalsy
    expect(registers.isFlagSet(Flag.V)).toBeFalsy
  })
  it('should correctly execute MSR APSR, R0 with R0 = 0xA0000000 (2 flags set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R0'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy
    expect(registers.isFlagSet(Flag.C)).toBeTruthy
    expect(registers.isFlagSet(Flag.V)).toBeFalsy
  })
  it('should correctly execute MSR APSR, R0 with R0 = 0x50000000 (2 flags set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R0'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy
    expect(registers.isFlagSet(Flag.Z)).toBeTruthy
    expect(registers.isFlagSet(Flag.C)).toBeFalsy
    expect(registers.isFlagSet(Flag.V)).toBeTruthy
  })
  it('should correctly execute MSR APSR, R0 with R0 = 0x80000000 (N flag set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R0'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy
    expect(registers.isFlagSet(Flag.C)).toBeFalsy
    expect(registers.isFlagSet(Flag.V)).toBeFalsy
  })
  it('should correctly execute MSR APSR, R0 with R0 = 0x01 (no flag set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R0'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy
    expect(registers.isFlagSet(Flag.C)).toBeFalsy
    expect(registers.isFlagSet(Flag.V)).toBeFalsy
  })
  it('should correctly execute MSR APSR, R0 with R0 = 0x0FFFFFFF (no flag set)', () => {
    let opcode = msrInstruction.encodeInstruction(['APSR', 'R0'])
    msrInstruction.executeInstruction(opcode, registers, memory)
    expect(registers.isFlagSet(Flag.N)).toBeFalsy
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy
    expect(registers.isFlagSet(Flag.C)).toBeFalsy
    expect(registers.isFlagSet(Flag.V)).toBeFalsy
  })
})
