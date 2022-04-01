import { add, sub } from 'board/alu'
import { Word } from 'types/binary'

let o1: Word
let o2: Word

describe('test add() function', () => {
  test('test that add() function returns correct result', () => {
    o1 = Word.fromUnsignedInteger(5)
    o2 = Word.fromUnsignedInteger(5)
    expect(add(o1, o2).result).toEqual(Word.fromUnsignedInteger(10))
    expect(add(o1, o2).result).toEqual(Word.fromSignedInteger(10))

    o1 = Word.fromUnsignedInteger(23483)
    o2 = Word.fromUnsignedInteger(83732)
    expect(add(o1, o2).result).toEqual(Word.fromUnsignedInteger(107215))
    expect(add(o1, o2).result).toEqual(Word.fromSignedInteger(107215))

    o1 = Word.fromSignedInteger(-10)
    o2 = Word.fromUnsignedInteger(20)
    expect(add(o1, o2).result).toEqual(Word.fromUnsignedInteger(10))
    expect(add(o1, o2).result).toEqual(Word.fromSignedInteger(10))

    o1 = Word.fromSignedInteger(-5)
    o2 = Word.fromSignedInteger(-5)
    expect(add(o1, o2).result).toEqual(Word.fromUnsignedInteger(4294967286))
    expect(add(o1, o2).result).toEqual(Word.fromSignedInteger(-10))

    o1 = Word.fromSignedInteger(-30)
    o2 = Word.fromSignedInteger(30)
    expect(add(o1, o2).result).toEqual(Word.fromUnsignedInteger(0))
    expect(add(o1, o2).result).toEqual(Word.fromSignedInteger(0))

    o1 = Word.fromUnsignedInteger(4294967295)
    o2 = Word.fromUnsignedInteger(1)
    expect(add(o1, o2).result).toEqual(Word.fromUnsignedInteger(0))
    expect(add(o1, o2).result).toEqual(Word.fromSignedInteger(0))

    o1 = Word.fromUnsignedInteger(4294967295)
    o2 = Word.fromUnsignedInteger(2)
    expect(add(o1, o2).result).toEqual(Word.fromUnsignedInteger(1))
    expect(add(o1, o2).result).toEqual(Word.fromSignedInteger(1))

    o1 = Word.fromUnsignedInteger(4294967295)
    o2 = Word.fromUnsignedInteger(0)
    expect(add(o1, o2).result).toEqual(Word.fromUnsignedInteger(4294967295))
    expect(add(o1, o2).result).toEqual(Word.fromSignedInteger(-1))
  })

  test('test that add() function returns correct N flag', () => {
    o1 = Word.fromUnsignedInteger(5)
    o2 = Word.fromUnsignedInteger(5)
    expect(add(o1, o2).N).toBe(false)

    o1 = Word.fromUnsignedInteger(23483)
    o2 = Word.fromUnsignedInteger(83732)
    expect(add(o1, o2).N).toBe(false)

    o1 = Word.fromSignedInteger(-10)
    o2 = Word.fromUnsignedInteger(20)
    expect(add(o1, o2).N).toBe(false)

    o1 = Word.fromSignedInteger(-5)
    o2 = Word.fromSignedInteger(-5)
    expect(add(o1, o2).N).toBe(true)

    o1 = Word.fromSignedInteger(-30)
    o2 = Word.fromSignedInteger(30)
    expect(add(o1, o2).N).toBe(false)

    o1 = Word.fromUnsignedInteger(4294967295)
    o2 = Word.fromUnsignedInteger(1)
    expect(add(o1, o2).N).toBe(false)

    o1 = Word.fromUnsignedInteger(4294967295)
    o2 = Word.fromUnsignedInteger(2)
    expect(add(o1, o2).N).toBe(false)

    o1 = Word.fromUnsignedInteger(4294967295)
    o2 = Word.fromUnsignedInteger(0)
    expect(add(o1, o2).N).toBe(true)
  })

  test('test that add() function returns correct Z flag', () => {
    o1 = Word.fromUnsignedInteger(5)
    o2 = Word.fromUnsignedInteger(5)
    expect(add(o1, o2).Z).toBe(false)

    o1 = Word.fromUnsignedInteger(23483)
    o2 = Word.fromUnsignedInteger(83732)
    expect(add(o1, o2).Z).toBe(false)

    o1 = Word.fromSignedInteger(-10)
    o2 = Word.fromUnsignedInteger(20)
    expect(add(o1, o2).Z).toBe(false)

    o1 = Word.fromSignedInteger(-5)
    o2 = Word.fromSignedInteger(-5)
    expect(add(o1, o2).Z).toBe(false)

    o1 = Word.fromSignedInteger(-30)
    o2 = Word.fromSignedInteger(30)
    expect(add(o1, o2).Z).toBe(true)

    o1 = Word.fromUnsignedInteger(4294967295)
    o2 = Word.fromUnsignedInteger(1)
    expect(add(o1, o2).Z).toBe(true)

    o1 = Word.fromUnsignedInteger(4294967295)
    o2 = Word.fromUnsignedInteger(2)
    expect(add(o1, o2).Z).toBe(false)

    o1 = Word.fromUnsignedInteger(4294967295)
    o2 = Word.fromUnsignedInteger(0)
    expect(add(o1, o2).Z).toBe(false)

    o1 = Word.fromSignedInteger(2147483647)
    o2 = Word.fromSignedInteger(1)
    expect(add(o1, o2).Z).toBe(false)
  })

  test('test that add() function returns correct C flag', () => {
    o1 = Word.fromUnsignedInteger(4294967295)
    o2 = Word.fromUnsignedInteger(0)
    expect(add(o1, o2).C).toBe(false)

    o1 = Word.fromUnsignedInteger(4294967295)
    o2 = Word.fromUnsignedInteger(1)
    expect(add(o1, o2).C).toBe(true)

    o1 = Word.fromSignedInteger(-1)
    o2 = Word.fromUnsignedInteger(1)
    expect(add(o1, o2).C).toBe(true)

    o1 = Word.fromUnsignedInteger(2147484648)
    o2 = Word.fromUnsignedInteger(4294967295)
    expect(add(o1, o2).C).toBe(true)
  })

  test('test that add() function returns correct V flag', () => {
    o1 = Word.fromSignedInteger(-1)
    o2 = Word.fromSignedInteger(5)
    expect(add(o1, o2).V).toBe(false)

    o1 = Word.fromSignedInteger(2147483647)
    o2 = Word.fromSignedInteger(0)
    expect(add(o1, o2).V).toBe(false)

    o1 = Word.fromSignedInteger(2147483647)
    o2 = Word.fromSignedInteger(1)
    expect(add(o1, o2).V).toBe(true)
  })
})

describe('test sub() function', () => {
  test('test that sub() function returns correct result', () => {
    o1 = Word.fromUnsignedInteger(5)
    o2 = Word.fromUnsignedInteger(5)
    expect(sub(o1, o2).result).toEqual(Word.fromUnsignedInteger(0))
    expect(sub(o1, o2).result).toEqual(Word.fromSignedInteger(0))

    o1 = Word.fromUnsignedInteger(0)
    o2 = Word.fromUnsignedInteger(10)
    expect(sub(o1, o2).result).toEqual(Word.fromUnsignedInteger(4294967286))
    expect(sub(o1, o2).result).toEqual(Word.fromSignedInteger(-10))

    o1 = Word.fromSignedInteger(-5)
    o2 = Word.fromSignedInteger(-5)
    expect(sub(o1, o2).result).toEqual(Word.fromUnsignedInteger(0))
    expect(sub(o1, o2).result).toEqual(Word.fromSignedInteger(0))

    o1 = Word.fromSignedInteger(-5)
    o2 = Word.fromSignedInteger(-10)
    expect(sub(o1, o2).result).toEqual(Word.fromUnsignedInteger(5))
    expect(sub(o1, o2).result).toEqual(Word.fromSignedInteger(5))
  })
})
