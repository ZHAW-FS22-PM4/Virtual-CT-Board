import { Word } from 'types/binary'
import { Register, Registers } from 'board/registers'
import { Memory } from 'board/memory'

import InstructionSet from 'instruction/set'

const registers = new Registers()
const memory = new Memory()

beforeEach(function () {
  registers.clear()
  memory.clear()
})

describe('SBCS instruction', function () {
  it('should allow 64bit substraction', function () {
    registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0x00000000))
    registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x0000ffff))
    registers.writeRegister(Register.R3, Word.fromUnsignedInteger(0xffff0000))
    registers.writeRegister(Register.R4, Word.fromUnsignedInteger(0x00000000))
    executeInstruction('SUBS', ['R1', 'R1', 'R3'])
    executeInstruction('SBCS', ['R2', 'R4'])
    expect(registers.readRegister(Register.R1).toSignedInteger()).toBe(
      0x00010000
    )
    expect(registers.readRegister(Register.R2).toSignedInteger()).toBe(
      0x0000fffe
    )
  })
})

function executeInstruction(name: string, options: string[]) {
  const encoder = InstructionSet.getEncoder(name, options)
  const opcode = encoder.encodeInstruction(options, {})
  const executor = InstructionSet.getExecutor(opcode)
  executor.executeInstruction(opcode, registers, memory)
}
