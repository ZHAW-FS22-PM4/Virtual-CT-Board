import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import InstructionSet from 'instruction/set'
import { Word } from 'types/binary'

const registers = new Registers()
const memory = new Memory()

beforeEach(function () {
  registers.reset()
  memory.reset()
})

describe('SBCS instruction', function () {
  it('should subtract borrow when set', function () {
    setupRegisters([0x0000ffff, 0x00000000], [0x00000000, 0xffff0000])
    executeSubstraction()
    checkResult([0x0000fffe, 0x00010000])
    checkFlags({ C: true, V: false })
  })
  it('should NOT subtract borrow when NOT set', function () {
    setupRegisters([0x0000ffff, 0xffff0000], [0x00000000, 0xffff0000])
    executeSubstraction()
    checkResult([0x0000ffff, 0x0000000])
    checkFlags({ C: true, V: false })
  })
  it('should set borrow when happens from substract', function () {
    setupRegisters([0x00000000, 0x00000000], [0x0000ffff, 0x00000000])
    executeSubstraction()
    checkResult([0xffff0001, 0x00000000])
    checkFlags({ C: false, V: false })
  })
  it('should set borrow when happens from borrow', function () {
    setupRegisters([0x00000000, 0x00000000], [0x00000000, 0xffff0000])
    executeSubstraction()
    checkResult([0xffffffff, 0x00010000])
    checkFlags({ C: false, V: false })
  })
})

function setupRegisters (dword1: number[], dword2: number[]) {
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(dword1[1]))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(dword1[0]))
  registers.writeRegister(Register.R3, Word.fromUnsignedInteger(dword2[1]))
  registers.writeRegister(Register.R4, Word.fromUnsignedInteger(dword2[0]))
}

function executeSubstraction () {
  executeInstruction('SUBS', ['R1', 'R1', 'R3'])
  executeInstruction('SBCS', ['R2', 'R4'])
}

function checkResult (dword: number[]) {
  expect(registers.readRegister(Register.R1).toUnsignedInteger()).toBe(dword[1])
  expect(registers.readRegister(Register.R2).toUnsignedInteger()).toBe(dword[0])
}

function checkFlags (flags: { C: boolean; V: boolean }) {
  expect(registers.isFlagSet(Flag.C)).toBe(flags.C)
  expect(registers.isFlagSet(Flag.V)).toBe(flags.V)
}

function executeInstruction (name: string, options: string[]) {
  const encoder = InstructionSet.getEncoder(name, options)
  const opcode = encoder.encodeInstruction(options, {})
  const executor = InstructionSet.getExecutor(opcode)
  executor.executeInstruction(opcode, registers, memory)
}
