import { AreaType } from 'assembler/ast'
import { parse } from 'assembler/parser'
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
    expect(ast.areas[1].instructions).toHaveLength(3)
    expect(ast.areas[1].instructions[0].name).toBe('MOVS')
    expect(ast.areas[1].instructions[0].options).toEqual(['R1', '#123'])
    expect(ast.areas[1].instructions[0].line).toBe(8)
    expect(ast.areas[1].instructions[1].name).toBe('MOVS')
    expect(ast.areas[1].instructions[1].label).toBe('label1')
    expect(ast.areas[1].instructions[1].options).toEqual(['R2', '#456'])
    expect(ast.areas[1].instructions[1].line).toBe(9)
    expect(ast.areas[1].instructions[2].name).toBe('MOVS')
    expect(ast.areas[1].instructions[2].label).toBe('label2')
    expect(ast.areas[1].instructions[2].options).toEqual(['R3', '#789'])
    expect(ast.areas[1].instructions[2].line).toBe(12)
  })
})

describe('parse text', function () {
  describe('line breaks', function () {
    it('should match rule on same line', function () {
      const onMatch = jest.fn()
      const rules: ITextParseRule[] = [
        {
          name: 'TEST',
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
  })
  describe('rules', function () {
    it('should prioritize first rule', function () {
      const onMatch1 = jest.fn()
      const onMatch2 = jest.fn()
      const rules: ITextParseRule[] = [
        {
          name: 'TEST',
          pattern: /TEST/,
          onMatch: onMatch1
        },
        {
          name: 'TEST',
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
