import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import InstructionSet from 'instruction/set'
import { Halfword, Word } from 'types/binary'

const name = 'RSBS'

const memory = new Memory()
const registers = new Registers()

beforeEach(function () {
  memory.reset()
  registers.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(4))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(8))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(16))
})

describe('Base instruction', function () {
  it('should throw error when opcode has invalid length', function () {
    const options = ['R1', 'R2', '#0']
    const encoder = InstructionSet.getEncoder(name, options)
    const opcode = encoder.encodeInstruction(options, {})
    const executor = InstructionSet.getExecutor(opcode[0])
    opcode.push(Halfword.fromSignedInteger(123))
    expect(() =>
      executor.executeInstruction(opcode, registers, memory)
    ).toThrow('Invalid opcode length.')
  })
})
