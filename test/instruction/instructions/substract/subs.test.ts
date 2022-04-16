import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import InstructionSet from 'instruction/set'
import { Word } from 'types/binary'

const name = 'SUBS'

const registers = new Registers()
const memory = new Memory()

beforeEach(function () {
  registers.reset()
  memory.reset()
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(2))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(4))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(16))
})

describe('SUBS instruction', function () {
  it('should subtract register from register and store in another register', function () {
    const options = ['R1', 'R3', 'R2']
    const encoder = InstructionSet.getEncoder(name, options)
    const opcode = encoder.encodeInstruction(options, {})
    const executor = InstructionSet.getExecutor(opcode)
    executor.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R1).value).toBe(12)
  })
  it('should subtract small immediate from register and store in another register', function () {
    const options = ['R2', 'R2', '#2']
    const encoder = InstructionSet.getEncoder(name, options)
    const opcode = encoder.encodeInstruction(options, {})
    const executor = InstructionSet.getExecutor(opcode)
    executor.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R2).value).toBe(2)
  })
  it('should subtract large immediate from register and store in first register', function () {
    const options = ['R3', '#12']
    const encoder = InstructionSet.getEncoder(name, options)
    const opcode = encoder.encodeInstruction(options, {})
    const executor = InstructionSet.getExecutor(opcode)
    executor.executeInstruction(opcode, registers, memory)
    expect(registers.readRegister(Register.R3).value).toBe(4)
  })
})
