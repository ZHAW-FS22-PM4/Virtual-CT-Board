import { AreaType, ICodeFile } from 'assembler/ast'
import { RelocationType } from 'assembler/elf/interfaces'
import { getSection } from 'assembler/elf/utils'
import { encode } from 'assembler/encoder'
import { AssemblerError } from 'assembler/error'
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
  it('should encode DCB instruction with Strings', function () {
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
              options: ['"TestString"', `"TestString '" with Escape'""`],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.data|').offset).toBe(0)
    expect(getSection(file, '|.data|').size).toBe(35)
    expect(file.content.length).toBe(35)
    expect(file.content[0].value).toBe(84)
    expect(file.content[1].value).toBe(101)
    expect(file.content[9].value).toBe(103)
    expect(file.content[10].value).toBe(84)
    expect(file.content[19].value).toBe(103)
    expect(file.content[21].value).toBe(34)
    expect(file.content[27].value).toBe(32)
    expect(file.content[33].value).toBe(101)
    expect(file.content[34].value).toBe(34)
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
  it('should encode DCD instruction with labels', function () {
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
              options: ['case1', 'case2'],
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
    expect(file.content[0].value).toBe(0x00)
    expect(file.content[1].value).toBe(0x00)
    expect(file.content[2].value).toBe(0x00)
    expect(file.content[3].value).toBe(0x00)
    expect(file.content[4].value).toBe(0x00)
    expect(file.content[5].value).toBe(0x00)
    expect(file.content[6].value).toBe(0x00)
    expect(file.content[7].value).toBe(0x00)

    expect(file.relocations.length).toBe(2)
    expect(file.relocations[0].type).toBe(RelocationType.Data)
    expect(file.relocations[0].section).toBe('|.data|')
    expect(file.relocations[0].offset).toBe(0)
    expect(file.relocations[0].length).toBe(4)
    expect(file.relocations[0].symbol).toBe('case1')
    expect(file.relocations[1].type).toBe(RelocationType.Data)
    expect(file.relocations[1].section).toBe('|.data|')
    expect(file.relocations[1].offset).toBe(4)
    expect(file.relocations[1].length).toBe(4)
    expect(file.relocations[1].symbol).toBe('case2')
  })
  it('should encode SPACE instruction with fix value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: 'SPACE',
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
  })

  it('should encode FILL instruction with fix value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: 'FILL',
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
  })

  it('should encode % instruction with fix value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: '%',
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
  })

  it('should encode SPACE instruction with calculated multiplication value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: 'SPACE',
              options: ['8*8'],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.data|').offset).toBe(0)
    expect(getSection(file, '|.data|').size).toBe(64)
    expect(file.content.length).toBe(64)
  })

  it('should encode FILL instruction with calculated multiplication value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: 'FILL',
              options: ['8*8'],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.data|').offset).toBe(0)
    expect(getSection(file, '|.data|').size).toBe(64)
    expect(file.content.length).toBe(64)
  })

  it('should encode % instruction with calculated multiplication value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: '%',
              options: ['8*8'],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.data|').offset).toBe(0)
    expect(getSection(file, '|.data|').size).toBe(64)
    expect(file.content.length).toBe(64)
  })

  it('should encode SPACE instruction with calculated addition value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: 'SPACE',
              options: ['8   +8'],
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
  })

  it('should encode FILL instruction with calculated addition value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: 'FILL',
              options: ['8   +8'],
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
  })

  it('should encode % instruction with calculated addition value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: '%',
              options: ['8   +8'],
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
  })

  it('should encode SPACE instruction with calculated addition, multiplication and brackets value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: 'SPACE',
              options: ['((8*(  (1+   1)+2)) )'],
              line: 0
            }
          ]
        },
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: 'secondData',
          instructions: [
            {
              name: 'SPACE',
              options: ['(   4+ 3   *4)'], //16
              line: 0
            },
            {
              name: 'SPACE',
              options: ['(8+8  )*8'], //128
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(2)
    expect(getSection(file, '|.data|').offset).toBe(0)
    expect(getSection(file, '|.data|').size).toBe(32)
    expect(getSection(file, 'secondData').offset).toBe(32)
    expect(getSection(file, 'secondData').size).toBe(144)
    expect(file.content.length).toBe(176)
  })

  it('should encode FILL instruction with calculated addition, multiplication and brackets value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: 'FILL',
              options: ['((8*(  (1+   1)+2)) )'],
              line: 0
            }
          ]
        },
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: 'secondData',
          instructions: [
            {
              name: 'FILL',
              options: ['(   4+ 3   *4)'], //16
              line: 0
            },
            {
              name: 'FILL',
              options: ['(8+8  )*8'], //128
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(2)
    expect(getSection(file, '|.data|').offset).toBe(0)
    expect(getSection(file, '|.data|').size).toBe(32)
    expect(getSection(file, 'secondData').offset).toBe(32)
    expect(getSection(file, 'secondData').size).toBe(144)
    expect(file.content.length).toBe(176)
  })

  it('should encode % instruction with calculated addition, multiplication and brackets value', function () {
    const code: ICodeFile = {
      symbols: {},
      areas: [
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: '|.data|',
          instructions: [
            {
              name: '%',
              options: ['((8*(  (1+   1)+2)) )'],
              line: 0
            }
          ]
        },
        {
          type: AreaType.Data,
          isReadOnly: true,
          name: 'secondData',
          instructions: [
            {
              name: '%',
              options: ['(   4+ 3   *4)'], //16
              line: 0
            },
            {
              name: '%',
              options: ['(8+8  )*8'], //128
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(2)
    expect(getSection(file, '|.data|').offset).toBe(0)
    expect(getSection(file, '|.data|').size).toBe(32)
    expect(getSection(file, 'secondData').offset).toBe(32)
    expect(getSection(file, 'secondData').size).toBe(144)
    expect(file.content.length).toBe(176)
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
              options: ['0x1'],
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
    expect(file.content[0].value).toBe(0x01)
    expect(file.content[1].value).toBe(0x00)
    expect(file.content[2].value).toBe(0x00)
    expect(file.content[3].value).toBe(0x00)
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
    expect(file.content[1].value).toBe(0x00)
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
      Halfword.fromUnsignedInteger(0x4906) //VCB-176 --> 0x4904 when pc is rounded up to next word
    )
    expect(Halfword.fromBytes(file.content[2], file.content[3])).toEqual(
      Halfword.fromUnsignedInteger(0x4a08)
    )
    expect(file.content[4]).toEqual(Byte.fromUnsignedInteger(0xff))
    expect(file.content[5]).toEqual(Byte.fromUnsignedInteger(0xff))
    expect(file.content[6]).toEqual(Byte.fromUnsignedInteger(0x00))
    expect(file.content[7]).toEqual(Byte.fromUnsignedInteger(0x00))
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
      Halfword.fromUnsignedInteger(0x4902) //VCB-176 --> 0x4900 when pc is rounded up to next word
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
  it('should encode code instruction that references equ constant', function () {
    const code: ICodeFile = {
      symbols: {
        ['MY_CONST']: '0xB'
      },
      areas: [
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.text|',
          instructions: [
            {
              name: 'MOVS',
              options: ['R1', '#MY_CONST'],
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
    expect(file.content[0].value).toBe(0xb)
    expect(file.content[1].value).toBe(0x21)
  })
  it('should encode code instruction that references equ constant within brackets', function () {
    const code: ICodeFile = {
      symbols: {
        ['MY_CONST']: '0x0'
      },
      areas: [
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.code|',
          instructions: [
            {
              name: 'STRB',
              options: ['R1', '[R0', '#MY_CONST]'],
              line: 0
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.code|').offset).toBe(0)
    expect(getSection(file, '|.code|').size).toBe(2)
    expect(file.content.length).toBe(2)
    expect(file.content[0].value).toBe(0x01)
    expect(file.content[1].value).toBe(0x70)
  })
  it('should throw error if instruction references unknown equ constant', function () {
    const code: ICodeFile = {
      symbols: {
        ['MY_CONST']: '0xB'
      },
      areas: [
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.text|',
          instructions: [
            {
              name: 'MOVS',
              options: ['R1', '#MY_UNKNOWN_CONST'],
              line: 0
            }
          ]
        }
      ]
    }
    expect(() => encode(code)).toThrow(AssemblerError)
  })
  it('should encode code instruction with immediate offset with spaces in between', function () {
    const code: ICodeFile = {
      symbols: {
        ['MY_CONST']: '0x0'
      },
      areas: [
        {
          type: AreaType.Code,
          isReadOnly: true,
          name: '|.code|',
          instructions: [
            {
              name: 'STRB',
              options: ['R1', '[R0', '#     MY_CONST]'],
              line: 0
            },
            {
              name: 'STRB',
              options: ['R1', '[R0', '#     5]'],
              line: 1
            },
            {
              name: 'MOVS',
              options: ['R0', '#     MY_CONST'],
              line: 2
            },
            {
              name: 'MOVS',
              options: ['R0', '#     5'],
              line: 3
            },
            {
              name: 'LDR',
              options: ['R0', '=       MY_CONST]'],
              line: 4
            },
            {
              name: 'LDR',
              options: ['R0', '=     0x5]'],
              line: 5
            }
          ]
        }
      ]
    }
    const file = encode(code)
    expect(Object.keys(file.sections).length).toBe(1)
    expect(getSection(file, '|.code|').offset).toBe(0)
    expect(getSection(file, '|.code|').size).toBe(24)
    expect(file.content.length).toBe(24)
    expect(file.content[0].value).toBe(0x01)
    expect(file.content[1].value).toBe(0x70)
    expect(file.content[2].value).toBe(0x41)
    expect(file.content[3].value).toBe(0x71)
    expect(file.content[4].value).toBe(0x00)
    expect(file.content[5].value).toBe(0x20)
    expect(file.content[6].value).toBe(0x05)
    expect(file.content[7].value).toBe(0x20)
  })
})
