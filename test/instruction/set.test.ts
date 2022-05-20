import { InstructionError } from 'instruction/error'
import { IInstruction } from 'instruction/interfaces'
import { InstructionSet } from 'instruction/set'
import { Halfword } from 'types/binary'

const validInstructionName = 'TEST'
const invalidInstructionName = 'ZZZ_notImplemeted'
const instruction: IInstruction = {
  name: validInstructionName,
  pattern: '11001100XXXXXXXX',
  patternSecondPart: '',
  opcodeLength: 1,
  needsLabels: false,
  canEncodeInstruction: jest.fn((name) => name === validInstructionName),
  encodeInstruction: jest.fn(),
  executeInstruction: jest.fn()
}

describe('InstructionSet', function () {
  const sut = new InstructionSet([instruction])
  it('should return encoder', function () {
    expect(sut.getEncoder(validInstructionName, [])).not.toBeNull()
  })
  it('should return error when no encoder found', function () {
    expect(() => sut.getEncoder(invalidInstructionName, [])).toThrowError(
      new InstructionError(
        `Unable to find instruction '${invalidInstructionName}'.`
      )
    )
  })
  it('should return executor', function () {
    const opcode = [Halfword.fromUnsignedInteger(0b1100110000000000)]
    expect(sut.getExecutor(opcode)).not.toBeNull()
  })
  it('should return error when no executor for opcode found', function () {
    expect(() =>
      sut.getExecutor([Halfword.fromUnsignedInteger(0xffff)])
    ).toThrowError(`Unable to find instruction executor for the opcode 'ffff'.`)
  })
})
