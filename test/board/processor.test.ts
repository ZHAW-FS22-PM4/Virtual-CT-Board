import { IMemory } from 'board/memory/interfaces'
import { IInstructionSet } from 'instruction/interfaces'

import { Processor } from 'board/processor'
import { Registers } from 'board/registers'

import { mock, instance, verify, anything } from 'ts-mockito'

const instructionSetMock: IInstructionSet = mock<IInstructionSet>()
const memoryMock: IMemory = mock<IMemory>()
const registersMock: Registers = mock(Registers)

test('test halt() function', () => {
  const processor: Processor = new Processor(
    instance(registersMock),
    instance(memoryMock),
    instance(instructionSetMock)
  )
  processor.halt()
})

test('test reset() function', () => {
  const processor: Processor = new Processor(
    instance(registersMock),
    instance(memoryMock),
    instance(instructionSetMock)
  )
  processor.reset()

  verify(memoryMock.reset()).called()
  verify(registersMock.reset()).called()
  verify(registersMock.writeRegister(anything(), anything())).twice()
})
