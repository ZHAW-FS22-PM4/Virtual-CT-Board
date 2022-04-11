import { IInstruction } from 'instruction/interfaces'
import { InstructionSet } from 'instruction/set'
import { Halfword } from 'types/binary'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'

const validInstructionName = 'TEST'
const invalidInstructionName = 'ZZZ_notImplemeted'
const instruction: IInstruction = {
  name: validInstructionName,
  pattern: '11001100XXXXXXXX',
  canEncodeInstruction: jest.fn((name) => name == validInstructionName),
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
      new VirtualBoardError(
        `Unable to find instruction encoder for the instruction '${invalidInstructionName}'.`,
        VirtualBoardErrorType.NoEncoderFound
      )
    )
  })
  it('should return executor', function () {
    const opcode = Halfword.fromUnsignedInteger(0b1100110000000000)
    expect(sut.getExecutor(opcode)).not.toBeNull()
  })
  it('should return error when no executor for opcode found', function () {
    expect(() =>
      sut.getExecutor(Halfword.fromUnsignedInteger(0xffff))
    ).toThrowError(`Unable to find instruction executor for the opcode 'ffff'.`)
  })
})
