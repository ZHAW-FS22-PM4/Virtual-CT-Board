import { Flash } from 'board/devices/flash'
import { MemoryBus } from 'board/memory/bus'
import { Processor } from 'board/processor'
import { Register, Registers } from 'board/registers'
import InstructionSet from 'instruction/set'
import { END_OF_CODE } from 'instruction/special'
import { Halfword, Word } from 'types/binary'

const registers = new Registers()
const memory = new MemoryBus([new Flash()])

function MOVS(...options: string[]): Halfword[] {
  return InstructionSet.getEncoder('MOVS', options).encodeInstruction(
    options,
    {}
  )
}

function WRITE_CODE(opcodes: Halfword[]) {
  memory.writeWord(
    Word.fromUnsignedInteger(0x08000000),
    Word.fromUnsignedInteger(0x20002000)
  )
  memory.writeWord(
    Word.fromUnsignedInteger(0x08000004),
    Word.fromUnsignedInteger(0x08000008)
  )
  let address = Word.fromUnsignedInteger(0x08000008)
  for (const opcode of opcodes) {
    memory.writeHalfword(address, opcode)
    address = address.add(2)
  }
  memory.writeHalfword(address, END_OF_CODE)
}

beforeEach(function () {
  registers.reset()
  memory.reset()
})

describe('execute', function () {
  it('should execute code', function () {
    WRITE_CODE(MOVS('R1', '#1'))
    const processor: Processor = new Processor(
      registers,
      memory,
      InstructionSet
    )
    processor.execute()
    expect(processor.isRunning()).toBe(true)
  })
})

describe('halt', function () {
  it('should halt execution', function () {
    WRITE_CODE(MOVS('R1', '#1'))
    const processor: Processor = new Processor(
      registers,
      memory,
      InstructionSet
    )
    processor.execute()
    expect(processor.isRunning()).toBe(true)
    processor.halt()
    expect(processor.isRunning()).toBe(false)
  })
})

describe('step', function () {
  it('should execute one instruction per step', function () {
    WRITE_CODE([...MOVS('R1', '#1'), ...MOVS('R2', '#2')])
    const processor: Processor = new Processor(
      registers,
      memory,
      InstructionSet
    )
    processor.reset()
    expect(registers.readRegister(Register.R1).toUnsignedInteger()).toBe(0)
    expect(registers.readRegister(Register.R2).toUnsignedInteger()).toBe(0)
    expect(registers.readRegister(Register.PC).toUnsignedInteger()).toBe(
      0x08000008
    )
    processor.step()
    expect(registers.readRegister(Register.R1).toUnsignedInteger()).toBe(1)
    expect(registers.readRegister(Register.R2).toUnsignedInteger()).toBe(0)
    expect(registers.readRegister(Register.PC).toUnsignedInteger()).toBe(
      0x0800000a
    )
    processor.step()
    expect(registers.readRegister(Register.R1).toUnsignedInteger()).toBe(1)
    expect(registers.readRegister(Register.R2).toUnsignedInteger()).toBe(2)
    expect(registers.readRegister(Register.PC).toUnsignedInteger()).toBe(
      0x0800000c
    )
  })
})
