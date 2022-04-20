import { Halfword } from 'types/binary'
import { IInstructionEncoder, IInstructionSet } from 'instruction/interfaces'
import { ICodeFile, AreaType } from 'assembler/ast'
import { encode } from 'assembler/encoder'

describe('encode', function () {
  it('should encode instruction', function () {
    const instructionSet: IInstructionSet = {
      getEncoder: jest.fn(
        (): IInstructionEncoder => ({
          name: 'MOVS',
          canEncodeInstruction: jest.fn(() => true),
          encodeInstruction: jest.fn(() => Halfword.fromUnsignedInteger(0x7744))
        })
      ),
      getExecutor: jest.fn()
    }
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.text|',
          instructions: [
            {
              name: 'MOVS',
              options: ['R1', 'R2'],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code, instructionSet)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(file.sections['|.text|'].offset.value).toBe(0)
    expect(file.sections['|.text|'].size.value).toBe(2)
    expect(file.content.length).toBe(2)
    expect(file.content[0].value).toBe(0x44)
    expect(file.content[1].value).toBe(0x77)
  })
  it('should encode DCB instruction', function () {
    const instructionSet: IInstructionSet = {
      getEncoder: jest.fn(),
      getExecutor: jest.fn()
    }
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: 'DCB',
              options: ['0x77', '0x44'],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code, instructionSet)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(file.sections['|.data|'].offset.value).toBe(0)
    expect(file.sections['|.data|'].size.value).toBe(2)
    expect(file.content.length).toBe(2)
    expect(file.content[0].value).toBe(0x77)
    expect(file.content[1].value).toBe(0x44)
  })
  it('should encode DCW instruction', function () {
    const instructionSet: IInstructionSet = {
      getEncoder: jest.fn(),
      getExecutor: jest.fn()
    }
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: 'DCW',
              options: ['0x77', '0x44'],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code, instructionSet)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(file.sections['|.data|'].offset.value).toBe(0)
    expect(file.sections['|.data|'].size.value).toBe(4)
    expect(file.content.length).toBe(4)
    expect(file.content[0].value).toBe(0x77)
    expect(file.content[1].value).toBe(0x00)
    expect(file.content[2].value).toBe(0x44)
    expect(file.content[3].value).toBe(0x00)
  })
  it('should encode DCD instruction', function () {
    const instructionSet: IInstructionSet = {
      getEncoder: jest.fn(),
      getExecutor: jest.fn()
    }
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: 'DCD',
              options: ['0x77', '0x44'],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code, instructionSet)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(file.sections['|.data|'].offset.value).toBe(0)
    expect(file.sections['|.data|'].size.value).toBe(8)
    expect(file.content.length).toBe(8)
    expect(file.content[0].value).toBe(0x77)
    expect(file.content[1].value).toBe(0x00)
    expect(file.content[2].value).toBe(0x00)
    expect(file.content[3].value).toBe(0x00)
    expect(file.content[4].value).toBe(0x44)
    expect(file.content[5].value).toBe(0x00)
    expect(file.content[6].value).toBe(0x00)
    expect(file.content[7].value).toBe(0x00)
  })
  it('should encode SPACE instruction', function () {
    for (const name of ['SPACE', 'FILL', '%']) {
      const instructionSet: IInstructionSet = {
        getEncoder: jest.fn(),
        getExecutor: jest.fn()
      }
      const code: ICodeFile = {
        symbols: {},
        areas: [
          {
            type: AreaType.Data,
            isReadOnly: true,
            name: '|.data|',
            instructions: [
              {
                name: name,
                options: ['16'],
                line: 0
              }
            ]
          }
        ]
      }
      const file = encode(code, instructionSet)
      expect(Object.keys(file.sections).length).toBe(1)
      expect(file.sections['|.data|'].offset.value).toBe(0)
      expect(file.sections['|.data|'].size.value).toBe(16)
      expect(file.content.length).toBe(16)
    }
  })
})
