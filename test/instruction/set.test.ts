import { IInstruction } from 'instruction/interfaces'
import { InstructionSet } from 'instruction/set'
import { Halfword } from 'types/binary'

const instruction: IInstruction = {
  name: 'TEST',
  pattern: '11001100XXXXXXXX',
  encodeInstruction: jest.fn(),
  executeInstruction: jest.fn()
}

describe('InstructionSet', function () {
  const sut = new InstructionSet([instruction])
  it('should return encoder', function () {
    expect(sut.getEncoder('TEST')).not.toBeNull()
  })
  it('should return executor', function () {
    const opcode = Halfword.fromUnsignedInteger(0b1100110000000000)
    expect(sut.getExecutor(opcode)).not.toBeNull()
  })
})
