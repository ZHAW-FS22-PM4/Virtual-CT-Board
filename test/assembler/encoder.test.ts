/**
 * Tests the encoder functionalities (translating parsed code into object file)
 */

import { ICode, IArea, IInstruction, AreaType } from 'assembler/ast'
import { encode, encodeDataInsruction } from 'assembler/encoder'
import { Byte } from 'types/binary'

import { mock, when, instance, verify, anything, spy } from 'ts-mockito'

const resultInstructionWithLabel: IInstruction[] = [
  { name: 'LDR', label: 'blue', params: ['R1', '=ADDR_LCD_COLOUR'] }
]

const codeMock: ICode = mock<ICode>()
const instructionMock: IInstruction = mock<IInstruction>()
const zeroByte: Byte = Byte.fromUnsignedInteger(0x00)
const movInstrucion: IInstruction = {
  name: 'MOV',
  label: '',
  params: ['R1', 'R2']
}
const movsInstrucion: IInstruction = {
  name: 'MOVS',
  label: '',
  params: ['R1', 'R2']
}
const dcbInstruction: IInstruction = {
  name: 'DCB',
  label: 'var1',
  params: ['0x15']
}
const dcwInstruction: IInstruction = {
  name: 'DCW',
  label: 'var2',
  params: ['0x9876']
}
const dcwByteArray: Byte[] = [
  Byte.fromUnsignedInteger(0x76),
  Byte.fromUnsignedInteger(0x98)
]
const dcdInstruction: IInstruction = {
  name: 'DCD',
  label: 'var3',
  params: ['0x22443553']
}
const dcdByteArray: Byte[] = [
  Byte.fromUnsignedInteger(0x53),
  Byte.fromUnsignedInteger(0x35),
  Byte.fromUnsignedInteger(0x44),
  Byte.fromUnsignedInteger(0x22)
]
const spaceInstruction: IInstruction = {
  name: 'SPACE',
  label: 'var3',
  params: ['12']
}

const readonlyCodeArea: IArea = {
  type: AreaType.Code,
  name: 'CODE',
  isReadOnly: true,
  instructions: [movInstrucion, movsInstrucion]
}

const codeArea: IArea = {
  type: AreaType.Code,
  name: 'CODE',
  isReadOnly: false,
  instructions: [movsInstrucion]
}
const dataArea: IArea = {
  type: AreaType.Data,
  name: 'DATA',
  isReadOnly: false,
  instructions: [movsInstrucion]
}
beforeEach(() => {
  //initial steps
  /*when(codeMock.areas).thenReturn([readonlyCodeArea, dataArea])
  let spaceMock: IInstruction = mock(spaceInstruction)
  when(spaceMock.params).thenReturn(['0x1234', '0x6789'])*/
})

/*describe('test encode function', () => {
  test('should return ')
})*/
describe('test encoder.encodeDataInsruction function', () => {
  test('should return correct byte array for data instruction', () => {
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcbInstruction, []),
      [Byte.fromUnsignedInteger(0x15)]
    )
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcwInstruction, []),
      dcwByteArray
    )
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcdInstruction, []),
      dcdByteArray
    )

    let spaceResult = encodeDataInsruction(spaceInstruction, [])
    expect(spaceResult.length).toBe(12)
    spaceInstruction.name = '%'
    spaceInstruction.params[0] = '3'
    spaceResult = encodeDataInsruction(spaceInstruction, [])
    expect(spaceResult.length).toBe(3)
  })
  test('should filled with zero bytes for correct alignment', () => {
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcwInstruction, [Byte.fromUnsignedInteger(0x12)]),
      [zeroByte, ...dcwByteArray]
    )
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcdInstruction, [Byte.fromUnsignedInteger(0x73)]),
      [zeroByte, zeroByte, zeroByte, ...dcdByteArray]
    )
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcdInstruction, [
        Byte.fromUnsignedInteger(0x73),
        Byte.fromUnsignedInteger(0x34)
      ]),
      [zeroByte, zeroByte, ...dcdByteArray]
    )
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcdInstruction, [
        Byte.fromUnsignedInteger(0x81),
        Byte.fromUnsignedInteger(0x34),
        Byte.fromUnsignedInteger(0x94)
      ]),
      [zeroByte, ...dcdByteArray]
    )
  })
  test('should return correct byte array for data instruction (multiple params)', () => {
    //TODO correct mocking
    let dcbMock: IInstruction = spy(dcbInstruction)
    when(dcbMock.params).thenReturn(['0x66', '0x72'])
    //when(dcbMock.name).thenReturn('DCB')
    let dcbMockInstance = instance(dcbMock)
    expect(dcbMockInstance.params).toEqual(['0x66', '0x72'])
    expect(dcbMockInstance.name).toEqual('DCB')
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcbMockInstance, []),
      [Byte.fromUnsignedInteger(0x66), Byte.fromUnsignedInteger(0x72)]
    )
    let dcwSpy: IInstruction = spy(dcwInstruction)
    when(dcwSpy.params).thenReturn([
      '0x9876', //TODO why does not work ...dcwInstruction.params,
      '0x1234',
      '0x5454',
      '0x9685'
    ])
    let dcwSpyInstance = instance(dcwSpy)

    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcwSpyInstance, []),
      [
        ...dcwByteArray,
        Byte.fromUnsignedInteger(0x34),
        Byte.fromUnsignedInteger(0x12),
        Byte.fromUnsignedInteger(0x54),
        Byte.fromUnsignedInteger(0x54),
        Byte.fromUnsignedInteger(0x85),
        Byte.fromUnsignedInteger(0x96)
      ]
    )
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcdInstruction, []),
      dcdByteArray
    )
  })
})

function testByteArrayWithLengthAndContent(result: Byte[], expected: Byte[]) {
  expect(result.length).toBe(expected.length)
  expect(result).toEqual(expected)
}
