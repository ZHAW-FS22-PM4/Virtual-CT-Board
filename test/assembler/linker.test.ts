import { AreaType, ICodeFile } from 'assembler/ast'
import { SegmentType } from 'assembler/elf/interfaces'
import { encode } from 'assembler/encoder'
import { link } from 'assembler/linker'
import { END_OF_CODE } from 'instruction/special'
import { Byte, Halfword, Word } from 'types/binary'

describe('linker', function () {
  it('should create code segment', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.text_1|',
          instructions: [
            {
              name: 'MOVS',
              options: ['R1', 'R2'],
              line: 0
            },
            {
              name: 'MOVS',
              options: ['R1', 'R2'],
              line: 1
            }
          ]
        },
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.text_2|',
          instructions: [
            {
              name: 'MOVS',
              options: ['R1', 'R2'],
              line: 2
            },
            {
              name: 'MOVS',
              options: ['R1', 'R2'],
              line: 3
            }
          ]
        }
      ]
    }
    const file = link(encode(code))
    expect(file.segments.length).toBe(1)
    expect(file.segments[0].type).toBe(SegmentType.Load)
    expect(file.segments[0].offset).toBe(0)
    expect(file.segments[0].size).toBe(24)
    expect(file.segments[0].address).toEqual(Word.fromSignedInteger(0x08000000))
    expect(file.sections.length).toBe(0)
    expect(Object.keys(file.symbols).length).toBe(0)
    expect(file.relocations.length).toBe(0)
    expect(file.sourceMap.getLine(Word.fromSignedInteger(0x08000008))).toBe(0)
    expect(file.sourceMap.getLine(Word.fromSignedInteger(0x0800000a))).toBe(1)
    expect(file.sourceMap.getLine(Word.fromSignedInteger(0x08000010))).toBe(2)
    expect(file.sourceMap.getLine(Word.fromSignedInteger(0x08000012))).toBe(3)
    expect(file.content.length).toBe(24)
    expect(
      Word.fromBytes(
        file.content[0],
        file.content[1],
        file.content[2],
        file.content[3]
      )
    ).toEqual(Word.fromUnsignedInteger(0x20002000))
    expect(
      Word.fromBytes(
        file.content[4],
        file.content[5],
        file.content[6],
        file.content[7]
      )
    ).toEqual(Word.fromUnsignedInteger(0x08000008))
    expect(Halfword.fromBytes(file.content[8], file.content[9])).toEqual(
      Halfword.fromUnsignedInteger(0x0011)
    )
    expect(Halfword.fromBytes(file.content[10], file.content[11])).toEqual(
      Halfword.fromUnsignedInteger(0x0011)
    )
    expect(Halfword.fromBytes(file.content[12], file.content[13])).toEqual(
      END_OF_CODE
    )
    expect(Halfword.fromBytes(file.content[14], file.content[15])).toEqual(
      Halfword.fromUnsignedInteger(0x0000)
    )
    expect(Halfword.fromBytes(file.content[16], file.content[17])).toEqual(
      Halfword.fromUnsignedInteger(0x0011)
    )
    expect(Halfword.fromBytes(file.content[18], file.content[19])).toEqual(
      Halfword.fromUnsignedInteger(0x0011)
    )
    expect(Halfword.fromBytes(file.content[20], file.content[21])).toEqual(
      END_OF_CODE
    )
    expect(Halfword.fromBytes(file.content[22], file.content[23])).toEqual(
      Halfword.fromUnsignedInteger(0x0000)
    )
  })
  it('should create data segment', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: false,
          name: '|.data|',
          instructions: [
            {
              name: 'DCB',
              options: ['0x22'],
              line: 0
            }
          ]
        },
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.text|',
          instructions: [
            {
              name: 'MOVS',
              options: ['R1', 'R2'],
              line: 1
            },
            {
              name: 'MOVS',
              options: ['R1', 'R2'],
              line: 2
            }
          ]
        }
      ]
    }
    const file = link(encode(code))
    expect(file.segments.length).toBe(2)
    expect(file.segments[0].type).toBe(SegmentType.Load)
    expect(file.segments[0].offset).toBe(0)
    expect(file.segments[0].size).toBe(16)
    expect(file.segments[0].address).toEqual(Word.fromSignedInteger(0x08000000))
    expect(file.segments[1].type).toBe(SegmentType.Load)
    expect(file.segments[1].offset).toBe(16)
    expect(file.segments[1].size).toBe(4)
    expect(file.segments[1].address).toEqual(Word.fromSignedInteger(0x20000000))
    expect(file.sections.length).toBe(0)
    expect(Object.keys(file.symbols).length).toBe(0)
    expect(file.relocations.length).toBe(0)
    expect(file.sourceMap.getLine(Word.fromSignedInteger(0x20000000))).toBe(0)
    expect(file.sourceMap.getLine(Word.fromSignedInteger(0x08000008))).toBe(1)
    expect(file.sourceMap.getLine(Word.fromSignedInteger(0x0800000a))).toBe(2)
    expect(file.content.length).toBe(20)
    expect(
      Word.fromBytes(
        file.content[0],
        file.content[1],
        file.content[2],
        file.content[3]
      )
    ).toEqual(Word.fromUnsignedInteger(0x20002000))
    expect(
      Word.fromBytes(
        file.content[4],
        file.content[5],
        file.content[6],
        file.content[7]
      )
    ).toEqual(Word.fromUnsignedInteger(0x08000008))
    expect(Halfword.fromBytes(file.content[8], file.content[9])).toEqual(
      Halfword.fromUnsignedInteger(0x0011)
    )
    expect(Halfword.fromBytes(file.content[10], file.content[11])).toEqual(
      Halfword.fromUnsignedInteger(0x0011)
    )
    expect(Halfword.fromBytes(file.content[12], file.content[13])).toEqual(
      END_OF_CODE
    )
    expect(Halfword.fromBytes(file.content[14], file.content[15])).toEqual(
      Halfword.fromUnsignedInteger(0x0000)
    )
    expect(file.content[16]).toEqual(Byte.fromUnsignedInteger(0x22))
    expect(file.content[17]).toEqual(Byte.fromUnsignedInteger(0x00))
    expect(file.content[18]).toEqual(Byte.fromUnsignedInteger(0x00))
    expect(file.content[19]).toEqual(Byte.fromUnsignedInteger(0x00))
  })
  it('should align sections in segments', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: false,
          name: '|.data_1|',
          instructions: [
            {
              name: 'DCB',
              options: ['0x22'],
              line: 0
            }
          ]
        },
        {
          type: AreaType.Data,
          isReadOnly: false,
          name: '|.data_2|',
          instructions: [
            {
              name: 'DCW',
              options: ['0x3333'],
              line: 1
            }
          ]
        },
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.text|',
          instructions: [
            {
              name: 'MOVS',
              options: ['R1', 'R2'],
              line: 2
            },
            {
              name: 'MOVS',
              options: ['R1', 'R2'],
              line: 3
            }
          ]
        }
      ]
    }
    const file = link(encode(code))
    expect(file.segments.length).toBe(2)
    expect(file.segments[0].type).toBe(SegmentType.Load)
    expect(file.segments[0].offset).toBe(0)
    expect(file.segments[0].size).toBe(16)
    expect(file.segments[0].address).toEqual(Word.fromSignedInteger(0x08000000))
    expect(file.segments[1].type).toBe(SegmentType.Load)
    expect(file.segments[1].offset).toBe(16)
    expect(file.segments[1].size).toBe(8)
    expect(file.segments[1].address).toEqual(Word.fromSignedInteger(0x20000000))
    expect(file.content.length).toBe(24)
    expect(
      Word.fromBytes(
        file.content[0],
        file.content[1],
        file.content[2],
        file.content[3]
      )
    ).toEqual(Word.fromUnsignedInteger(0x20002000))
    expect(
      Word.fromBytes(
        file.content[4],
        file.content[5],
        file.content[6],
        file.content[7]
      )
    ).toEqual(Word.fromUnsignedInteger(0x08000008))
    expect(Halfword.fromBytes(file.content[8], file.content[9])).toEqual(
      Halfword.fromUnsignedInteger(0x0011)
    )
    expect(Halfword.fromBytes(file.content[10], file.content[11])).toEqual(
      Halfword.fromUnsignedInteger(0x0011)
    )
    expect(Halfword.fromBytes(file.content[12], file.content[13])).toEqual(
      END_OF_CODE
    )
    expect(Halfword.fromBytes(file.content[14], file.content[15])).toEqual(
      Halfword.fromUnsignedInteger(0x0000)
    )
    expect(file.content[16]).toEqual(Byte.fromUnsignedInteger(0x22))
    expect(file.content[17]).toEqual(Byte.fromUnsignedInteger(0x00))
    expect(file.content[18]).toEqual(Byte.fromUnsignedInteger(0x00))
    expect(file.content[19]).toEqual(Byte.fromUnsignedInteger(0x00))
    expect(file.content[20]).toEqual(Byte.fromUnsignedInteger(0x33))
    expect(file.content[21]).toEqual(Byte.fromUnsignedInteger(0x33))
    expect(file.content[22]).toEqual(Byte.fromUnsignedInteger(0x00))
    expect(file.content[23]).toEqual(Byte.fromUnsignedInteger(0x00))
  })
  it('should apply data relocations', function () {
    const code: ICodeFile = {
      symbols: {
        LITERAL_CONSTANT: '0x33'
      },
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
    const file = link(encode(code))
    expect(file.segments.length).toBe(1)
    expect(file.segments[0].type).toBe(SegmentType.Load)
    expect(file.segments[0].offset).toBe(0)
    expect(file.segments[0].size).toBe(20)
    expect(file.segments[0].address).toEqual(Word.fromSignedInteger(0x08000000))
    expect(file.sections.length).toBe(0)
    expect(Object.keys(file.symbols).length).toBe(0)
    expect(file.relocations.length).toBe(0)
    expect(file.sourceMap.getLine(Word.fromSignedInteger(0x08000008))).toBe(0)
    expect(file.content.length).toBe(20)
    expect(
      Word.fromBytes(
        file.content[12],
        file.content[13],
        file.content[14],
        file.content[15]
      )
    ).toEqual(Word.fromUnsignedInteger(0x33))
  })
  it('should apply code relocations', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.text|',
          instructions: [
            {
              name: 'B',
              options: ['label1'],
              line: 1
            },
            {
              name: 'MOVS',
              options: ['R1', 'R2'],
              line: 2,
              label: 'label1'
            }
          ]
        }
      ]
    }
    const file = link(encode(code))
    expect(file.segments.length).toBe(1)
    expect(file.segments[0].type).toBe(SegmentType.Load)
    expect(file.segments[0].offset).toBe(0)
    expect(file.segments[0].size).toBe(16)
    expect(file.segments[0].address).toEqual(Word.fromSignedInteger(0x08000000))
    expect(file.sections.length).toBe(0)
    expect(Object.keys(file.symbols).length).toBe(0)
    expect(file.relocations.length).toBe(0)
    expect(file.sourceMap.getLine(Word.fromSignedInteger(0x08000008))).toBe(1)
    expect(file.content.length).toBe(16)
    expect(
      Word.fromBytes(
        file.content[10],
        file.content[11],
        file.content[12],
        file.content[13]
      )
    ).toEqual(Word.fromUnsignedInteger(0xffff0011))
  })
})
