import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import { RsbsInstruction } from 'instruction/instructions/subtract/rsbs'
import InstructionSet from 'instruction/set'
import { Halfword, Word } from 'types/binary'

const name = 'RSBS'
const rsbsInstr = new RsbsInstruction()

const registers = new Registers()
const memory = new Memory()

beforeEach(function () {
  registers.reset()
  memory.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(4))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(8))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(16))
})

describe('RSBS instruction', function () {
  it('should reverse substract a register and store in another register', function () {
    const options = ['R1', 'R2', '#0']
    const encoder = InstructionSet.getEncoder(name, options)
    const opcode = encoder.encodeInstruction(options, {})
    const executor = InstructionSet.getExecutor(opcode)
    executor.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).toSignedInteger()).toBe(-8)
  })
  it('should require #0 as third option', function () {
    const options = ['R1', 'R2', '#2']
    const encoder = InstructionSet.getEncoder(name, options)
    expect(() => encoder.encodeInstruction(options, {})).toThrow()
  })

  it('should create correct opcode for RSBS R6, R3, #0', () => {
    let opcode = rsbsInstr.encodeInstruction(['R6', 'R3', '#000'])
    expect(opcode[0].toBinaryString()).toEqual('0100001001011110')
  })

  it('should throw when a high register is provided as param for RSBS R10, R2, #0', () => {
    expect(() => rsbsInstr.encodeInstruction(['R10', 'R2', '#0'])).toThrow()
  })

  it('should throw when not #0 is provided as immediate for RSBS', () => {
    expect(() => rsbsInstr.encodeInstruction(['R1', 'R2', '#1'])).toThrow()
  })

  it('should write correct result to Rn (RSBS R6, R3, #0; R3 = 0x12345678)', () => {
    registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0x12345678))
    rsbsInstr.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0100001001011110)],
      registers,
      memory
    )
    expect(registers.readRegister(Register.R6).value).toEqual(0xedcba988)
    expect(registers.isFlagSet(Flag.N)).toBeTruthy()
    expect(registers.isFlagSet(Flag.Z)).toBeFalsy()
    expect(registers.isFlagSet(Flag.C)).toBeFalsy()
    expect(registers.isFlagSet(Flag.V)).toBeFalsy()
  })
})
