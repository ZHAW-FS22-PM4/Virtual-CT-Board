import { Word } from 'types/binary'
import { Register, Registers } from 'board/registers'
import { Memory } from 'board/memory'

import InstructionSet from 'instruction/set'

const name = 'RSBS'

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
})
