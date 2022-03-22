/**
 * Tests the encoder functionalities (translating parsed code into object file)
 */

import { ICode, IArea, IInstruction, AreaType } from 'assembler/ast'
import {
  encode,
  encodeDataInsruction,
  encodeCodeInstruction
} from 'assembler/encoder'
import { Byte, Halfword, Word } from 'types/binary'

import { mock, when, instance, verify, anything } from 'ts-mockito'
import { VirtualBoardError } from 'types/error'

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
const movsImmediateInstrucion: IInstruction = {
  name: 'MOVS',
  label: '',
  params: ['R6', '#12']
}
const movsImmediateHexInstrucion: IInstruction = {
  name: 'MOVS',
  label: '',
  params: ['R6', '#0x12']
}
const dcbInstruction: IInstruction = {
  name: 'DCB',
  label: 'var1',
  params: ['0x15']
}
const dcbByteArray: Byte[] = [Byte.fromUnsignedInteger(0x15)]
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
  instructions: [] //[movInstrucion, movsInstrucion]
}
const codeArea: IArea = {
  type: AreaType.Code,
  name: 'CODE',
  isReadOnly: false,
  instructions: [] //[movsInstrucion]
}
const dataArea: IArea = {
  type: AreaType.Data,
  name: 'DATA',
  isReadOnly: false,
  instructions: [dcdInstruction, spaceInstruction, dcbInstruction]
}

let dcbInstructionMock: IInstruction
let dcwInstructionMock: IInstruction
let dcdInstructionMock: IInstruction
let movInstructionMock: IInstruction
let movsInstructionMock: IInstruction
let movsImmediateInstructionMock: IInstruction
let movsImmediateHexInstructionMock: IInstruction
let codeMock: ICode
beforeEach(() => {
  //equivalent dcwInstructionMock = createInstructionMock('DCW', 'var2', ['0x9876'])
  dcwInstructionMock = createInstructionMockOfInstruction(dcwInstruction)
  dcbInstructionMock = createInstructionMockOfInstruction(dcbInstruction)
  dcdInstructionMock = createInstructionMockOfInstruction(dcdInstruction)

  movInstructionMock = createInstructionMockOfInstruction(movInstrucion)
  movsInstructionMock = createInstructionMockOfInstruction(movsInstrucion)
  movsImmediateInstructionMock = createInstructionMockOfInstruction(
    movsImmediateInstrucion
  )
  movsImmediateHexInstructionMock = createInstructionMockOfInstruction(
    movsImmediateHexInstrucion
  )

  const codeMockTemplate: ICode = mock<ICode>()
  when(codeMockTemplate.areas).thenReturn([readonlyCodeArea, dataArea])
  codeMock = instance(codeMockTemplate)

  /*let spaceMock: IInstruction = mock(spaceInstruction)
  when(spaceMock.params).thenReturn(['0x1234', '0x6789'])*/
})

//afterEach(() => {})

function createInstructionMock(name: string, label: string, params: string[]) {
  const mockTemplate: IInstruction = mock<IInstruction>()
  when(mockTemplate.name).thenReturn(name)
  when(mockTemplate.label).thenReturn(label)
  when(mockTemplate.params).thenReturn(params)
  return instance(mockTemplate)
}
function createInstructionMockOfInstruction(instr: IInstruction) {
  return createInstructionMock(instr.name, instr.label, instr.params)
}

describe('test encode function', () => {
  test('should return correct offset for section', () => {
    let result = encode(codeMock)
    expect(result.sections.length).toBe(2)
    expect(result.sections[0].offset).toStrictEqual(
      Word.fromUnsignedInteger(0x08000000)
    )
    expect(result.sections[1].offset).toStrictEqual(
      Word.fromUnsignedInteger(0x20010000)
    )
    expect(result.sections[1].content.length).toBe(17)

    const codeMockTemplate: ICode = mock<ICode>()
    when(codeMockTemplate.areas).thenReturn([codeArea])
    let codeMock2 = instance(codeMockTemplate)
    let result2 = encode(codeMock2)
    expect(result2.sections.length).toBe(1)
    expect(result2.sections[0].offset).toStrictEqual(
      Word.fromUnsignedInteger(0x20000000)
    )
  })
})
describe('test encoder.encodeDataInsruction function', () => {
  test('should return correct byte array for data instruction', () => {
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcbInstructionMock, []),
      dcbByteArray
    )
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcwInstructionMock, []),
      dcwByteArray
    )
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcdInstructionMock, []),
      dcdByteArray
    )

    let spaceResult = encodeDataInsruction(spaceInstruction, [])
    expect(spaceResult.length).toBe(12)
    spaceInstruction.name = '%'
    spaceInstruction.params[0] = '3'
    spaceResult = encodeDataInsruction(spaceInstruction, [])
    expect(spaceResult.length).toBe(3)
  })

  test('should return correct byte array for data instruction (multiple params)', () => {
    let dcbAlternativeMock = createInstructionMock(
      dcbInstruction.name,
      'var12',
      [...dcbInstruction.params, '0x66', '0x72']
    )

    expect(dcbAlternativeMock.params).toEqual(['0x15', '0x66', '0x72'])
    //expect(dcbMockInstance.name).toEqual('DCB')
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcbAlternativeMock, []),
      [
        ...dcbByteArray,
        Byte.fromUnsignedInteger(0x66),
        Byte.fromUnsignedInteger(0x72)
      ]
    )
    let dcwAlternativeMock = createInstructionMock(
      dcwInstruction.name,
      'var7',
      [...dcwInstruction.params, '0x1234', '0x5454', '0x9685']
    )

    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcwAlternativeMock, []),
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

    let dcdAlternativeMock = createInstructionMock(
      dcdInstruction.name,
      'var8',
      [...dcdInstruction.params, '0x35462469']
    )

    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcdAlternativeMock, []),
      [
        ...dcdByteArray,
        Byte.fromUnsignedInteger(0x69),
        Byte.fromUnsignedInteger(0x24),
        Byte.fromUnsignedInteger(0x46),
        Byte.fromUnsignedInteger(0x35)
      ]
    )
  })

  test('should filled with zero bytes for correct alignment', () => {
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcwInstructionMock, [
        Byte.fromUnsignedInteger(0x12)
      ]),
      [zeroByte, ...dcwByteArray]
    )
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcdInstructionMock, [
        Byte.fromUnsignedInteger(0x73)
      ]),
      [zeroByte, zeroByte, zeroByte, ...dcdByteArray]
    )
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcdInstructionMock, [
        Byte.fromUnsignedInteger(0x73),
        Byte.fromUnsignedInteger(0x34)
      ]),
      [zeroByte, zeroByte, ...dcdByteArray]
    )
    testByteArrayWithLengthAndContent(
      encodeDataInsruction(dcdInstructionMock, [
        Byte.fromUnsignedInteger(0x81),
        Byte.fromUnsignedInteger(0x34),
        Byte.fromUnsignedInteger(0x94)
      ]),
      [zeroByte, ...dcdByteArray]
    )
  })
})

function testByteArrayWithLengthAndContent(result: Byte[], expected: Byte[]) {
  expect(result.length).toBe(expected.length)
  expect(result).toEqual(expected)
}

describe('test encoder.encodeCodeInstruction function', () => {
  /*test('should return correct byte array for code instruction', () => {
    testByteArrayWithLengthAndContent(encodeCodeInstruction(movInstrucion), tbd)
    testByteArrayWithLengthAndContent(
      encodeCodeInstruction(movsInstructionMock),
      tbd
    )
    testByteArrayWithLengthAndContent(
      encodeCodeInstruction(movsImmediateInstructionMock),
      tbd
    )
    testByteArrayWithLengthAndContent(
      encodeCodeInstruction(movsImmediateHexInstructionMock),
      tbd
    )
  })*/
  test('should return byte array with zeros for invalid instructions', () => {
    //expect(Halfword.fromUnsignedInteger(0).toBytes()).toBe([zeroByte, zeroByte])
    testByteArrayWithLengthAndContent(
      encodeCodeInstruction(dcwInstructionMock),
      [] //should return two 0 bytes [zeroByte, zeroByte]
    )
    testByteArrayWithLengthAndContent(
      encodeCodeInstruction(createInstructionMock('NOTIMPLEMENTED', '', [])),
      [] //should return two 0 bytes [zeroByte, zeroByte][zeroByte, zeroByte]
    )
  })
})
