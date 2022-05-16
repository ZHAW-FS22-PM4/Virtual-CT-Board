import { Memory } from 'board/memory'
import { Registers } from 'board/registers'
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
