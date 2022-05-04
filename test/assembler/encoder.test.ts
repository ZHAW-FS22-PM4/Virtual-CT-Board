import { AreaType, ICodeFile } from 'assembler/ast'
import { RelocationType } from 'assembler/elf/interfaces'
import { getSection } from 'assembler/elf/utils'
import { encode } from 'assembler/encoder'
import { Byte, Halfword, Word } from 'types/binary'

describe('encode', function () {
  it('should encode code instruction', function () {
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
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.text|').offset).toBe(0)
    expect(getSection(file, '|.text|').size).toBe(2)
    expect(file.content.length).toBe(2)
    expect(file.content[0].value).toBe(0x11)
    expect(file.content[1].value).toBe(0x0)
  })
  it('should encode DCB instruction', function () {
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
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.data|').offset).toBe(0)
    expect(getSection(file, '|.data|').size).toBe(2)
    expect(file.content.length).toBe(2)
    expect(file.content[0].value).toBe(0x77)
    expect(file.content[1].value).toBe(0x44)
  })
  it('should encode DCW instruction', function () {
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
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.data|').offset).toBe(0)
    expect(getSection(file, '|.data|').size).toBe(4)
    expect(file.content.length).toBe(4)
    expect(file.content[0].value).toBe(0x77)
    expect(file.content[1].value).toBe(0x00)
    expect(file.content[2].value).toBe(0x44)
    expect(file.content[3].value).toBe(0x00)
  })
  it('should encode DCD instruction', function () {
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
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.data|').offset).toBe(0)
    expect(getSection(file, '|.data|').size).toBe(8)
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
      const file = encode(code)
      expect(Object.keys(file.sections).length).toBe(1)
      expect(getSection(file, '|.data|').offset).toBe(0)
      expect(getSection(file, '|.data|').size).toBe(16)
      expect(file.content.length).toBe(16)
    }
  })
  it('should encode ALIGN instruction', function () {
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
              options: ['0x0'],
              line: 0
            },
            {
              name: 'ALIGN',
              options: ['4'],
              line: 1
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.data|').offset).toBe(0)
    expect(getSection(file, '|.data|').size).toBe(4)
    expect(file.content.length).toBe(4)
    expect(file.content[0].value).toBe(0x00)
    expect(file.content[1].value).toBe(0xff)
    expect(file.content[2].value).toBe(0xff)
    expect(file.content[3].value).toBe(0xff)
  })
  it('should should align code instruction', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.text|',
          instructions: [
            {
              name: 'DCB',
              options: ['0x0'],
              line: 0
            },
            {
              name: 'MOVS',
              options: ['R1', 'R2'],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.text|').offset).toBe(0)
    expect(getSection(file, '|.text|').size).toBe(4)
    expect(file.content.length).toBe(4)
    expect(file.content[0].value).toBe(0x00)
    expect(file.content[1].value).toBe(0xff)
    expect(file.content[2].value).toBe(0x11)
    expect(file.content[3].value).toBe(0x0)
  })
  it('should encode psuedo instruction using literal and create literal pool', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.text|',
          instructions: [
            {
              name: 'LDR',
              options: ['R1', '=0x11'],
              line: 0
            },
            {
              name: 'LDR',
              options: ['R2', '=0x22'],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.text|').offset).toBe(0)
    expect(getSection(file, '|.text|').size).toBe(16)
    expect(file.content.length).toBe(16)
    expect(Halfword.fromBytes(file.content[0], file.content[1])).toEqual(
      Halfword.fromUnsignedInteger(0x4904)
    )
    expect(Halfword.fromBytes(file.content[2], file.content[3])).toEqual(
      Halfword.fromUnsignedInteger(0x4a08)
    )
    expect(file.content[4]).toEqual(Byte.fromUnsignedInteger(0xff))
    expect(file.content[5]).toEqual(Byte.fromUnsignedInteger(0xff))
    expect(file.content[6]).toEqual(Byte.fromUnsignedInteger(0xff))
    expect(file.content[7]).toEqual(Byte.fromUnsignedInteger(0xff))
    expect(
      Word.fromBytes(
        file.content[8],
        file.content[9],
        file.content[10],
        file.content[11]
      )
    ).toEqual(Word.fromUnsignedInteger(0x11))
    expect(
      Word.fromBytes(
        file.content[12],
        file.content[13],
        file.content[14],
        file.content[15]
      )
    ).toEqual(Word.fromUnsignedInteger(0x22))
  })
  it('should encode psuedo instruction using symbol and create literal pool', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.text|',
          instructions: [
            {
              name: 'LDR',
              options: ['R1', '=LITERAL_CONSTANT'],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.text|').offset).toBe(0)
    expect(getSection(file, '|.text|').size).toBe(8)
    expect(file.content.length).toBe(8)
    expect(file.relocations.length).toBe(1)
    expect(file.relocations[0].type).toBe(RelocationType.Data)
    expect(file.relocations[0].section).toBe('|.text|')
    expect(file.relocations[0].offset).toBe(4)
    expect(file.relocations[0].length).toBe(4)
    expect(file.relocations[0].symbol).toBe('LITERAL_CONSTANT')
    expect(Halfword.fromBytes(file.content[0], file.content[1])).toEqual(
      Halfword.fromUnsignedInteger(0x4902)
    )
    expect(file.content[2]).toEqual(Byte.fromUnsignedInteger(0xff))
    expect(file.content[3]).toEqual(Byte.fromUnsignedInteger(0xff))
    expect(
      Word.fromBytes(
        file.content[4],
        file.content[5],
        file.content[6],
        file.content[7]
      )
    ).toEqual(Word.fromUnsignedInteger(0x00))
  })
})
