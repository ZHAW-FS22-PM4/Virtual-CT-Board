import { AluResult, add, sub } from 'board/alu'
import { Word } from 'types/binary'

let w1: Word
let w2: Word
let r: AluResult

describe('test add() function', () => {
  test('test that add() function returns correct result', () => {
    // + + + = +
    w1 = Word.fromUnsignedInteger(25)
    w2 = Word.fromUnsignedInteger(25)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(50))
    expect(r.result).toEqual(Word.fromSignedInteger(50))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(false)
    expect(r.V).toBe(false)
    expect(r.C).toBe(false)

    // - + + = +
    w1 = Word.fromSignedInteger(-25)
    w2 = Word.fromUnsignedInteger(50)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(25))
    expect(r.result).toEqual(Word.fromSignedInteger(25))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(false)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)

    // - + + = -
    w1 = Word.fromSignedInteger(-25)
    w2 = Word.fromUnsignedInteger(10)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(4294967281))
    expect(r.result).toEqual(Word.fromSignedInteger(-15))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(true)
    expect(r.V).toBe(false)
    expect(r.C).toBe(false)

    // - + + = 0
    w1 = Word.fromSignedInteger(-25)
    w2 = Word.fromUnsignedInteger(25)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(0))
    expect(r.result).toEqual(Word.fromSignedInteger(0))
    expect(r.Z).toBe(true)
    expect(r.N).toBe(false)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)

    // + + - = +
    w1 = Word.fromUnsignedInteger(25)
    w2 = Word.fromSignedInteger(-10)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(15))
    expect(r.result).toEqual(Word.fromSignedInteger(15))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(false)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)

    // + + - = -
    w1 = Word.fromUnsignedInteger(25)
    w2 = Word.fromSignedInteger(-50)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(4294967271))
    expect(r.result).toEqual(Word.fromSignedInteger(-25))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(true)
    expect(r.V).toBe(false)
    expect(r.C).toBe(false)

    // + + - = 0
    w1 = Word.fromUnsignedInteger(25)
    w2 = Word.fromSignedInteger(-25)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(0))
    expect(r.result).toEqual(Word.fromSignedInteger(0))
    expect(r.Z).toBe(true)
    expect(r.N).toBe(false)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)

    // - + - = -
    w1 = Word.fromSignedInteger(-25)
    w2 = Word.fromSignedInteger(-25)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(4294967246))
    expect(r.result).toEqual(Word.fromSignedInteger(-50))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(true)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)
  })

  test('tests for C flag for add() function', () => {
    w1 = Word.fromUnsignedInteger(4294967295)
    w2 = Word.fromUnsignedInteger(0)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(4294967295))
    expect(r.result).toEqual(Word.fromSignedInteger(-1))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(true)
    expect(r.V).toBe(false)
    expect(r.C).toBe(false)

    w1 = Word.fromUnsignedInteger(4294967295)
    w2 = Word.fromUnsignedInteger(1)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(0))
    expect(r.result).toEqual(Word.fromSignedInteger(0))
    expect(r.Z).toBe(true)
    expect(r.N).toBe(false)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)

    w1 = Word.fromSignedInteger(-5)
    w2 = Word.fromSignedInteger(-3)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(4294967288))
    expect(r.result).toEqual(Word.fromSignedInteger(-8))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(true)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)
  })

  test('tests for V flag for add() function', () => {
    w1 = Word.fromSignedInteger(-2147483648)
    w2 = Word.fromSignedInteger(0)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(2147483648))
    expect(r.result).toEqual(Word.fromSignedInteger(-2147483648))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(true)
    expect(r.V).toBe(false)
    expect(r.C).toBe(false)

    w1 = Word.fromSignedInteger(-2147483648)
    w2 = Word.fromSignedInteger(-1)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(2147483647))
    expect(r.result).toEqual(Word.fromSignedInteger(2147483647))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(false)
    expect(r.V).toBe(true)
    expect(r.C).toBe(true)

    w1 = Word.fromSignedInteger(100000)
    w2 = Word.fromSignedInteger(2147483647)
    r = add(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(2147583647))
    expect(r.result).toEqual(Word.fromSignedInteger(-2147383649))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(true)
    expect(r.V).toBe(true)
    expect(r.C).toBe(false)
  })
})

describe('test sub() function', () => {
  test('test that sub() function returns correct result', () => {
    // + - + = +
    w1 = Word.fromUnsignedInteger(25)
    w2 = Word.fromUnsignedInteger(15)
    r = sub(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(10))
    expect(r.result).toEqual(Word.fromSignedInteger(10))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(false)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)

    // + - + = -
    w1 = Word.fromUnsignedInteger(25)
    w2 = Word.fromUnsignedInteger(35)
    r = sub(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(4294967286))
    expect(r.result).toEqual(Word.fromSignedInteger(-10))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(true)
    expect(r.V).toBe(false)
    expect(r.C).toBe(false)

    // + - + = 0
    w1 = Word.fromUnsignedInteger(25)
    w2 = Word.fromUnsignedInteger(25)
    r = sub(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(0))
    expect(r.result).toEqual(Word.fromSignedInteger(0))
    expect(r.Z).toBe(true)
    expect(r.N).toBe(false)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)

    // - - + = -
    w1 = Word.fromSignedInteger(-25)
    w2 = Word.fromUnsignedInteger(25)
    r = sub(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(4294967246))
    expect(r.result).toEqual(Word.fromSignedInteger(-50))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(true)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)

    // + - - = +
    w1 = Word.fromUnsignedInteger(25)
    w2 = Word.fromSignedInteger(-25)
    r = sub(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(50))
    expect(r.result).toEqual(Word.fromSignedInteger(50))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(false)
    expect(r.V).toBe(false)
    expect(r.C).toBe(false)

    // - - - = +
    w1 = Word.fromSignedInteger(-25)
    w2 = Word.fromSignedInteger(-50)
    r = sub(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(25))
    expect(r.result).toEqual(Word.fromSignedInteger(25))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(false)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)

    // - - - = -
    w1 = Word.fromSignedInteger(-25)
    w2 = Word.fromSignedInteger(-15)
    r = sub(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(4294967286))
    expect(r.result).toEqual(Word.fromSignedInteger(-10))
    expect(r.Z).toBe(false)
    expect(r.N).toBe(true)
    expect(r.V).toBe(false)
    expect(r.C).toBe(false)

    // - - - = 0
    w1 = Word.fromSignedInteger(-25)
    w2 = Word.fromSignedInteger(-25)
    r = sub(w1, w2)
    expect(r.result).toEqual(Word.fromUnsignedInteger(0))
    expect(r.result).toEqual(Word.fromSignedInteger(0))
    expect(r.Z).toBe(true)
    expect(r.N).toBe(false)
    expect(r.V).toBe(false)
    expect(r.C).toBe(true)
  })
})
