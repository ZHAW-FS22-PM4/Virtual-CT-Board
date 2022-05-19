import { AreaType } from 'assembler/ast'
import { parse } from 'assembler/parser'
import { ParseError } from 'assembler/parser/error'
import { ITextParseRule, parseText } from 'assembler/parser/text'

const code = `
MY_CONSTANT EQU 0x123
 PRESERVE8
 THUMB
 AREA |.data|, DATA, READWRITE
  ; A comment
  DCD 0xFF ; A comment
 AREA |.text|, CODE, READONLY
         MOVS R1, #123
  label1 MOVS R2, #456

  ALIGN

  label2
         MOVS R3, #789
`

describe('parse code', function () {
  it('can parse assembler code', function () {
    const ast = parse(code)
    expect(Object.keys(ast.symbols)).toHaveLength(1)
    expect(ast.symbols['MY_CONSTANT']).toBe('0x123')
    expect(ast.areas).toHaveLength(2)
    expect(ast.areas[0].name).toBe('|.data|')
    expect(ast.areas[0].type).toBe(AreaType.Data)
    expect(ast.areas[0].isReadOnly).toBe(false)
    expect(ast.areas[0].instructions).toHaveLength(1)
    expect(ast.areas[0].instructions[0].name).toBe('DCD')
    expect(ast.areas[0].instructions[0].options).toEqual(['0xFF'])
    expect(ast.areas[0].instructions[0].line).toBe(6)
    expect(ast.areas[1].name).toBe('|.text|')
    expect(ast.areas[1].type).toBe(AreaType.Code)
    expect(ast.areas[1].isReadOnly).toBe(true)
    expect(ast.areas[1].instructions).toHaveLength(4)
    expect(ast.areas[1].instructions[0].name).toBe('MOVS')
    expect(ast.areas[1].instructions[0].options).toEqual(['R1', '#123'])
    expect(ast.areas[1].instructions[0].line).toBe(8)
    expect(ast.areas[1].instructions[1].name).toBe('MOVS')
    expect(ast.areas[1].instructions[1].label).toBe('label1')
    expect(ast.areas[1].instructions[1].options).toEqual(['R2', '#456'])
    expect(ast.areas[1].instructions[1].line).toBe(9)
    expect(ast.areas[1].instructions[2].name).toBe('ALIGN')
    expect(ast.areas[1].instructions[2].options.length).toBe(0)
    expect(ast.areas[1].instructions[3].name).toBe('MOVS')
    expect(ast.areas[1].instructions[3].label).toBe('label2')
    expect(ast.areas[1].instructions[3].options).toEqual(['R3', '#789'])
    expect(ast.areas[1].instructions[3].line).toBe(14)
  })
  it('can parse load without offset instruction', function () {
    const loadCode = `
    AREA myCode, CODE, READONLY
             LDR R4, [R5]

             LDR R7, [PC]
    other    LDRH R1, [R3]
             LDRB R5, [R2]

             LDR R5, [PC, #0x00]
    `
    const ast = parse(loadCode)
    expect(Object.keys(ast.symbols)).toHaveLength(0)
    expect(ast.areas).toHaveLength(1)
    expect(ast.areas[0].name).toBe('myCode')
    expect(ast.areas[0].type).toBe(AreaType.Code)
    expect(ast.areas[0].isReadOnly).toBe(true)
    expect(ast.areas[0].instructions).toHaveLength(5)
    expect(ast.areas[0].instructions[0].name).toBe('LDR')
    expect(ast.areas[0].instructions[0].options).toEqual(['R4', '[R5]'])
    expect(ast.areas[0].instructions[0].line).toBe(2)
    expect(ast.areas[0].instructions[1].name).toBe('LDR')
    expect(ast.areas[0].instructions[1].label).toBeUndefined()
    expect(ast.areas[0].instructions[1].options).toEqual(['R7', '[PC]'])
    expect(ast.areas[0].instructions[1].line).toBe(4)
    expect(ast.areas[0].instructions[2].name).toBe('LDRH')
    expect(ast.areas[0].instructions[2].label).toBe('other')
    expect(ast.areas[0].instructions[2].options).toEqual(['R1', '[R3]'])
    expect(ast.areas[0].instructions[2].line).toBe(5)
    expect(ast.areas[0].instructions[3].name).toBe('LDRB')
    expect(ast.areas[0].instructions[3].label).toBeUndefined()
    expect(ast.areas[0].instructions[3].options).toEqual(['R5', '[R2]'])
    expect(ast.areas[0].instructions[3].line).toBe(6)
    expect(ast.areas[0].instructions[4].name).toBe('LDR')
    expect(ast.areas[0].instructions[4].options).toEqual([
      'R5',
      '[PC',
      '#0x00]'
    ])
    expect(ast.areas[0].instructions[4].line).toBe(8)
  })
  it('can parse store without offset instruction', function () {
    const loadCode = `
    AREA myCode, CODE, READONLY
             STR R4, [R5]
    other    STRH R1, [R3]

             STRB R5, [R2]
             STR R5, [R6, #0x00]
    `
    const ast = parse(loadCode)
    expect(Object.keys(ast.symbols)).toHaveLength(0)
    expect(ast.areas).toHaveLength(1)
    expect(ast.areas[0].name).toBe('myCode')
    expect(ast.areas[0].type).toBe(AreaType.Code)
    expect(ast.areas[0].isReadOnly).toBe(true)
    expect(ast.areas[0].instructions).toHaveLength(4)
    expect(ast.areas[0].instructions[0].name).toBe('STR')
    expect(ast.areas[0].instructions[0].options).toEqual(['R4', '[R5]'])
    expect(ast.areas[0].instructions[0].line).toBe(2)
    expect(ast.areas[0].instructions[1].name).toBe('STRH')
    expect(ast.areas[0].instructions[1].label).toBe('other')
    expect(ast.areas[0].instructions[1].options).toEqual(['R1', '[R3]'])
    expect(ast.areas[0].instructions[1].line).toBe(3)
    expect(ast.areas[0].instructions[2].name).toBe('STRB')
    expect(ast.areas[0].instructions[2].label).toBeUndefined()
    expect(ast.areas[0].instructions[2].options).toEqual(['R5', '[R2]'])
    expect(ast.areas[0].instructions[2].line).toBe(5)
    expect(ast.areas[0].instructions[3].name).toBe('STR')
    expect(ast.areas[0].instructions[3].options).toEqual([
      'R5',
      '[R6',
      '#0x00]'
    ])
    expect(ast.areas[0].instructions[3].line).toBe(6)
  })

  it('can parse SPACE and FILL instruction', function () {
    const loadCode = `
    AREA myCode, CODE, READONLY
             STR R4, [R5]
        SPACE 8*8
    `
    const ast = parse(loadCode)
    expect(Object.keys(ast.symbols)).toHaveLength(0)
    expect(ast.areas).toHaveLength(1)
    expect(ast.areas[0].name).toBe('myCode')
    expect(ast.areas[0].type).toBe(AreaType.Code)
    expect(ast.areas[0].isReadOnly).toBe(true)
    expect(ast.areas[0].instructions).toHaveLength(2)
    expect(ast.areas[0].instructions[0].name).toBe('STR')
    expect(ast.areas[0].instructions[0].options).toEqual(['R4', '[R5]'])
    expect(ast.areas[0].instructions[0].line).toBe(2)
    expect(ast.areas[0].instructions[1].name).toBe('SPACE')
    expect(ast.areas[0].instructions[1].label).toBeUndefined()
    expect(ast.areas[0].instructions[1].options).toEqual(['8*8'])
    expect(ast.areas[0].instructions[1].line).toBe(3)
  })

  it('can parse pseudo instruction code', function () {
    const pseudoCode = `
    SOME_VALUE EQU 0x78ecd8e7
    OTHER_VALUE EQU 0x0
    AREA myData, DATA, READWRITE
    var1 DCD 0xAE, 0x12, 0x34 ; A comment
    var2
    ;description for var2
    DCD 0x33554466

    AREA Pseudo, CODE, READONLY

         LDR R5,var1
         LDR R6,=0x20003000
         LDR R0, =SOME_VALUE
        LDR R4,=var2    
    `
    const ast = parse(pseudoCode)
    expect(Object.keys(ast.symbols)).toHaveLength(2)
    expect(ast.symbols['SOME_VALUE']).toBe('0x78ecd8e7')
    expect(ast.symbols['OTHER_VALUE']).toBe('0x0')
    expect(ast.areas).toHaveLength(2)
    expect(ast.areas[0].name).toBe('myData')
    expect(ast.areas[0].type).toBe(AreaType.Data)
    expect(ast.areas[0].isReadOnly).toBe(false)
    expect(ast.areas[0].instructions).toHaveLength(2)
    expect(ast.areas[0].instructions[0].name).toBe('DCD')
    expect(ast.areas[0].instructions[0].label).toBe('var1')
    expect(ast.areas[0].instructions[0].options).toEqual([
      '0xAE',
      '0x12',
      '0x34'
    ])
    expect(ast.areas[0].instructions[0].line).toBe(4)
    expect(ast.areas[0].instructions[1].name).toBe('DCD')
    expect(ast.areas[0].instructions[1].label).toBe('var2')
    expect(ast.areas[0].instructions[1].options).toEqual(['0x33554466'])
    expect(ast.areas[0].instructions[1].line).toBe(7)
    expect(ast.areas[1].name).toBe('Pseudo')
    expect(ast.areas[1].type).toBe(AreaType.Code)
    expect(ast.areas[1].isReadOnly).toBe(true)
    expect(ast.areas[1].instructions).toHaveLength(4)
    expect(ast.areas[1].instructions[0].name).toBe('LDR')
    expect(ast.areas[1].instructions[0].options).toEqual(['R5', 'var1'])
    expect(ast.areas[1].instructions[0].line).toBe(11)
    expect(ast.areas[1].instructions[1].name).toBe('LDR')
    expect(ast.areas[1].instructions[1].options).toEqual(['R6', '=0x20003000'])
    expect(ast.areas[1].instructions[1].line).toBe(12)
    expect(ast.areas[1].instructions[2].name).toBe('LDR')
    expect(ast.areas[1].instructions[2].options).toEqual(['R0', '=SOME_VALUE'])
    expect(ast.areas[1].instructions[2].line).toBe(13)
    expect(ast.areas[1].instructions[3].name).toBe('LDR')
    expect(ast.areas[1].instructions[3].options).toEqual(['R4', '=var2'])
    expect(ast.areas[1].instructions[3].line).toBe(14)
  })
  it('can parse immediate offsets with spaces in between', () => {
    const pseudoCode = `
    AREA myCode, CODE, READWRITE
    LDR R7, =   0x08123456f
    start LDR R6, =  var1
    LDR R0, =  ADDR_DIP_SWITCH_7_0
    LDR R1, =	0x90000000
    MOVS R2, #	44
    `
    const ast = parse(pseudoCode)
    expect(ast.areas.length).toBe(1)
    expect(ast.areas[0].instructions.length).toBe(5)

    expect(ast.areas[0].instructions[0].name).toBe('LDR')
    expect(ast.areas[0].instructions[0].options.length).toBe(2)

    expect(ast.areas[0].instructions[1].name).toBe('LDR')
    expect(ast.areas[0].instructions[1].label).toBeDefined()
    expect(ast.areas[0].instructions[1].options.length).toBe(2)

    expect(ast.areas[0].instructions[2].name).toBe('LDR')
    expect(ast.areas[0].instructions[2].options.length).toBe(2)

    expect(ast.areas[0].instructions[3].name).toBe('LDR')
    expect(ast.areas[0].instructions[3].options.length).toBe(2)

    expect(ast.areas[0].instructions[4].name).toBe('MOVS')
    expect(ast.areas[0].instructions[4].options.length).toBe(2)
  })
})

describe('parse text', function () {
  describe('line breaks', function () {
    it('should match rule on same line', function () {
      const onMatch = jest.fn()
      const rules: ITextParseRule[] = [
        {
          name: 'TEST',
          indentRequired: false,
          pattern: /TEST/,
          onMatch
        }
      ]
      const cursor = parseText('TEST'.repeat(3), rules)
      expect(cursor).toEqual({ index: 12, line: 0, position: 12 })
      expect(onMatch).toBeCalledTimes(3)
      expect(onMatch).toHaveBeenNthCalledWith(1, {
        from: { index: 0, line: 0, position: 0 },
        to: { index: 4, line: 0, position: 4 },
        text: 'TEST',
        captures: []
      })
      expect(onMatch).toHaveBeenNthCalledWith(2, {
        from: { index: 4, line: 0, position: 4 },
        to: { index: 8, line: 0, position: 8 },
        text: 'TEST',
        captures: []
      })
      expect(onMatch).toHaveBeenNthCalledWith(3, {
        from: { index: 8, line: 0, position: 8 },
        to: { index: 12, line: 0, position: 12 },
        text: 'TEST',
        captures: []
      })
    })
    it('should match rule containing line breaks', function () {
      const onMatch = jest.fn()
      const rules: ITextParseRule[] = [
        {
          name: 'TEST',
          indentRequired: false,
          pattern: /TEST\n/,
          onMatch
        }
      ]
      const cursor = parseText('TEST\n'.repeat(3), rules)
      expect(cursor).toEqual({ index: 15, line: 3, position: 0 })
      expect(onMatch).toBeCalledTimes(3)
      expect(onMatch).toHaveBeenNthCalledWith(1, {
        from: { index: 0, line: 0, position: 0 },
        to: { index: 5, line: 1, position: 0 },
        text: 'TEST\n',
        captures: []
      })
      expect(onMatch).toHaveBeenNthCalledWith(2, {
        from: { index: 5, line: 1, position: 0 },
        to: { index: 10, line: 2, position: 0 },
        text: 'TEST\n',
        captures: []
      })
      expect(onMatch).toHaveBeenNthCalledWith(3, {
        from: { index: 10, line: 2, position: 0 },
        to: { index: 15, line: 3, position: 0 },
        text: 'TEST\n',
        captures: []
      })
    })
    it('should match rule containing multiple line breaks', function () {
      const onMatch = jest.fn()
      const rules: ITextParseRule[] = [
        {
          name: 'TEST',
          indentRequired: false,
          pattern: /TEST\nTEST\nT/,
          onMatch
        }
      ]
      const cursor = parseText('TEST\nTEST\nT'.repeat(3), rules)
      expect(cursor).toEqual({ index: 33, line: 6, position: 1 })
      expect(onMatch).toBeCalledTimes(3)
      expect(onMatch).toHaveBeenNthCalledWith(1, {
        from: { index: 0, line: 0, position: 0 },
        to: { index: 11, line: 2, position: 1 },
        text: 'TEST\nTEST\nT',
        captures: []
      })
      expect(onMatch).toHaveBeenNthCalledWith(2, {
        from: { index: 11, line: 2, position: 1 },
        to: { index: 22, line: 4, position: 1 },
        text: 'TEST\nTEST\nT',
        captures: []
      })
      expect(onMatch).toHaveBeenNthCalledWith(3, {
        from: { index: 22, line: 4, position: 1 },
        to: { index: 33, line: 6, position: 1 },
        text: 'TEST\nTEST\nT',
        captures: []
      })
    })
    it('should match rule containing optional line break', function () {
      const onMatch = jest.fn()
      const rules: ITextParseRule[] = [
        {
          name: 'TEST',
          indentRequired: false,
          pattern: /TEST\n?/,
          onMatch
        }
      ]
      const cursor = parseText('TESTTEST\nTEST', rules)
      expect(cursor).toEqual({ index: 13, line: 1, position: 4 })
      expect(onMatch).toBeCalledTimes(3)
      expect(onMatch).toHaveBeenNthCalledWith(1, {
        from: { index: 0, line: 0, position: 0 },
        to: { index: 4, line: 0, position: 4 },
        text: 'TEST',
        captures: []
      })
      expect(onMatch).toHaveBeenNthCalledWith(2, {
        from: { index: 4, line: 0, position: 4 },
        to: { index: 9, line: 1, position: 0 },
        text: 'TEST\n',
        captures: []
      })
      expect(onMatch).toHaveBeenNthCalledWith(3, {
        from: { index: 9, line: 1, position: 0 },
        to: { index: 13, line: 1, position: 4 },
        text: 'TEST',
        captures: []
      })
    })
    it('should match rule containing line break in the middle', function () {
      const onMatch = jest.fn()
      const rules: ITextParseRule[] = [
        {
          name: 'TEST',
          indentRequired: false,
          pattern: /TEST\nTEST/,
          onMatch
        }
      ]
      const cursor = parseText('TEST\nTEST'.repeat(3), rules)
      expect(cursor).toEqual({ index: 27, line: 3, position: 4 })
      expect(onMatch).toBeCalledTimes(3)
      expect(onMatch).toHaveBeenNthCalledWith(1, {
        from: { index: 0, line: 0, position: 0 },
        to: { index: 9, line: 1, position: 4 },
        text: 'TEST\nTEST',
        captures: []
      })
      expect(onMatch).toHaveBeenNthCalledWith(2, {
        from: { index: 9, line: 1, position: 4 },
        to: { index: 18, line: 2, position: 4 },
        text: 'TEST\nTEST',
        captures: []
      })
      expect(onMatch).toHaveBeenNthCalledWith(3, {
        from: { index: 18, line: 2, position: 4 },
        to: { index: 27, line: 3, position: 4 },
        text: 'TEST\nTEST',
        captures: []
      })
    })
    it('should throw if instruction is not indented', function () {
      const onMatch = jest.fn()
      const rules: ITextParseRule[] = [
        {
          name: 'Whitespace',
          indentRequired: false,
          pattern: /\s+/,
          onMatch
        },
        {
          name: 'TEST',
          indentRequired: true,
          pattern: /TEST/,
          onMatch
        }
      ]

      const instrNotIndented = 'Instruction not indented by space or tab.'
      let parseError = new ParseError(instrNotIndented, {
        index: 0,
        line: 1,
        position: 0
      })
      expect(() => parseText(' TEST\nTEST', rules)).toThrow(parseError)
      parseError = new ParseError(instrNotIndented, {
        index: 0,
        line: 0,
        position: 0
      })
      expect(() => parseText('TEST\nTEST', rules)).toThrow(parseError)
    })
  })
  describe('rules', function () {
    it('should prioritize first rule', function () {
      const onMatch1 = jest.fn()
      const onMatch2 = jest.fn()
      const rules: ITextParseRule[] = [
        {
          name: 'TEST',
          indentRequired: false,
          pattern: /TEST/,
          onMatch: onMatch1
        },
        {
          name: 'TEST',
          indentRequired: false,
          pattern: /T*/,
          onMatch: onMatch2
        }
      ]
      const cursor = parseText('TEST'.repeat(2) + 'T'.repeat(4), rules)
      expect(cursor).toEqual({ index: 12, line: 0, position: 12 })
      expect(onMatch1).toBeCalledTimes(2)
      expect(onMatch1).toHaveBeenNthCalledWith(1, {
        from: { index: 0, line: 0, position: 0 },
        to: { index: 4, line: 0, position: 4 },
        text: 'TEST',
        captures: []
      })
      expect(onMatch1).toHaveBeenNthCalledWith(2, {
        from: { index: 4, line: 0, position: 4 },
        to: { index: 8, line: 0, position: 8 },
        text: 'TEST',
        captures: []
      })
      expect(onMatch2).toBeCalledTimes(1)
      expect(onMatch2).toHaveBeenNthCalledWith(1, {
        from: { index: 8, line: 0, position: 8 },
        to: { index: 12, line: 0, position: 12 },
        text: 'TTTT',
        captures: []
      })
    })
    it('should stop when unkown token occurs', function () {
      const onMatch = jest.fn()
      const rules: ITextParseRule[] = [
        {
          name: 'TEST',
          indentRequired: false,
          pattern: /TEST/,
          onMatch: onMatch
        }
      ]
      const cursor = parseText('TESTABCTEST', rules)
      expect(cursor).toEqual({ index: 4, line: 0, position: 4 })
      expect(onMatch).toBeCalledTimes(1)
      expect(onMatch).toHaveBeenNthCalledWith(1, {
        from: { index: 0, line: 0, position: 0 },
        to: { index: 4, line: 0, position: 4 },
        text: 'TEST',
        captures: []
      })
    })
  })
})
describe('parse error handling', function () {
  it('should throw ParseError for label not within area', function () {
    const labelNotInArea = 'Label must be defined in area'
    let parseError = new ParseError(labelNotInArea, {
      index: 0,
      line: 1,
      position: 4
    })
    expect(() =>
      parse(`
    label
    ADDR_DIP_SWITCH_15_8    EQU     0x60000201
    
    AREA MyCode, CODE, READONLY
        PUSH	{R1,R3} 
    `)
    ).toThrow(parseError)
    parseError = new ParseError(labelNotInArea, {
      index: 0,
      line: 3,
      position: 0
    })
    expect(() =>
      parse(`
    ADDR_DIP_SWITCH_15_8    EQU     0x60000201
    
label

    AREA MyCode, CODE, READONLY
        PUSH	{R1,R3} 
    `)
    ).toThrow(parseError)
  })
  it('should throw ParseError for instruction not within area', function () {
    const instrNotInArea = 'Instruction must be defined in area'
    let parseError = new ParseError(instrNotInArea, {
      index: 0,
      line: 0,
      position: 1
    })
    expect(() =>
      parse(` ASRS R2, R2, R4

    ADDR_DIP_SWITCH_15_8    EQU     0x60000201
    
    AREA MyCode, CODE, READONLY
        PUSH	{R1,R3} 
    `)
    ).toThrow(parseError)
    parseError = new ParseError(instrNotInArea, {
      index: 0,
      line: 2,
      position: 4
    })
    expect(() =>
      parse(`
    ADDR_DIP_SWITCH_15_8    EQU     0x60000201
    RORS R2, R2, R4
    AREA MyCode, CODE, READONLY
        PUSH	{R1,R3} 
    `)
    ).toThrow(parseError)
  })
  it('should throw ParseError for instruction not starting with tab or space', function () {
    const instrNotIndented = 'Instruction not indented by space or tab.'
    let parseError = new ParseError(instrNotIndented, {
      index: 0,
      line: 3,
      position: 0
    })
    expect(() =>
      parse(`
    ADDR_DIP_SWITCH_15_8    EQU     0x60000201
    AREA MyCode, CODE, READONLY
MVNS R1,R5
    `)
    ).toThrow(parseError)
    parseError = new ParseError(instrNotIndented, {
      index: 0,
      line: 4,
      position: 0
    })
    expect(() =>
      parse(`
    ADDR_DIP_SWITCH_15_8    EQU     0x60000201
    AREA MyCode, CODE, READONLY
    ORRS R4, R4, R1
TST R1, R5
    BICS R1,R1,R5
    `)
    ).toThrow(parseError)
  })
  it('should throw ParseError for unknown token (&)', function () {
    const unknownToken = 'Unknown token'
    let parseError = new ParseError(unknownToken, {
      index: 0,
      line: 0,
      position: 0
    })
    expect(() =>
      parse(`&
      ADDR_DIP_SWITCH_15_8    EQU     0x60000201
      ADDR_LED_15_8           EQU     0x60000101
      ADDR_LED_23_16          EQU     0x60000102
      ADDR_LED_31_24          EQU     0x60000103
            AREA MyCode, CODE, READONLY
    
    main    PROC
            EXPORT main
        
        LDR		R0, =ADDR_DIP_SWITCH_15_8
        LDRB	R0, [R0]
        LSLS	R0, R0, #24
        ALIGN
        ; End of code
        ENDP
        END
    `)
    ).toThrow(parseError)

    parseError = new ParseError(unknownToken, {
      index: 0,
      line: 1,
      position: 6
    })
    expect(() =>
      parse(`
      &
      ADDR_DIP_SWITCH_15_8    EQU     0x60000201
      ADDR_LED_15_8           EQU     0x60000101
      ADDR_LED_23_16          EQU     0x60000102
      ADDR_LED_31_24          EQU     0x60000103
            AREA MyCode, CODE, READONLY
    
    main    PROC
            EXPORT main
        
        LDR		R0, =ADDR_DIP_SWITCH_15_8
        LDRB	R0, [R0]
        LSLS	R0, R0, #24
        ALIGN
        ; End of code
        ENDP
        END
    `)
    ).toThrow(parseError)

    parseError = new ParseError(unknownToken, {
      index: 0,
      line: 9,
      position: 2
    })
    expect(() =>
      parse(`
      ADDR_DIP_SWITCH_15_8    EQU     0x60000201
      ADDR_LED_15_8           EQU     0x60000101
      ADDR_LED_23_16          EQU     0x60000102
      ADDR_LED_31_24          EQU     0x60000103
            AREA MyCode, CODE, READONLY
    
    main    PROC
            EXPORT main
  &
        LDR		R0, =ADDR_DIP_SWITCH_15_8
        LDRB	R0, &[R0]
        LSLS	R0, R0, #24
        ALIGN
        ; End of code
        ENDP
        END
    `)
    ).toThrow(parseError)
    parseError = new ParseError(unknownToken, {
      index: 0,
      line: 11,
      position: 8
    })
    expect(() =>
      parse(`
      ADDR_DIP_SWITCH_15_8    EQU     0x60000201
      ADDR_LED_15_8           EQU     0x60000101
      ADDR_LED_23_16          EQU     0x60000102
      ADDR_LED_31_24          EQU     0x60000103
            AREA MyCode, CODE, READONLY
    
    main    PROC
            EXPORT main
  
        LDR		R0, =ADDR_DIP_SWITCH_15_8
        LDRB &R0, [R0]
        LSLS	R0, R0, #24
        ALIGN
        ; End of code
        ENDP
        END
    `)
    ).toThrow(parseError)
    parseError = new ParseError(unknownToken, {
      index: 0,
      line: 11,
      position: 15
    })
    expect(() =>
      parse(`
      ADDR_DIP_SWITCH_15_8    EQU     0x60000201
      ADDR_LED_15_8           EQU     0x60000101
      ADDR_LED_23_16          EQU     0x60000102
      ADDR_LED_31_24          EQU     0x60000103
            AREA MyCode, CODE, READONLY
    
    main    PROC
            EXPORT main
  
        LDR		R0, =ADDR_DIP_SWITCH_15_8
        LDRB	R0, &[R0]
        LSLS	R0, R0, #24
        ALIGN
        ; End of code
        ENDP
        END
    `)
    ).toThrow(parseError)
  })
})
