import { Memory } from 'board/memory'
import { Registers } from 'board/registers'
import { MrsInstruction } from 'instruction/instructions/flags/mrs'

const registers = new Registers()
const memory = new Memory()

const mrsInstruction = new MrsInstruction()

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
