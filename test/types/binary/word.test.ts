import { Byte, Halfword, Word } from 'types/binary'
import { BinaryType } from 'types/binary/binaryType'

const word_ffffffff = Word.fromUnsignedInteger(4294967295)
const word_00000000 = Word.fromUnsignedInteger(0)
const word_00010000 = Word.fromUnsignedInteger(65536)
const word_0fffffff = Word.fromUnsignedInteger(268435455)
const word_f0000000 = Word.fromUnsignedInteger(4026531840)
const word_f0000001 = Word.fromUnsignedInteger(4026531841)

describe('fromUnsignedInteger method', () => {
  test('fromUnsignedInteger_validValues', () => {
    expect(Word.fromUnsignedInteger(4294967295).value).toBe(4294967295)
    expect(Word.fromUnsignedInteger(65535).value).toBe(65535)
    expect(Word.fromUnsignedInteger(0).value).toBe(0)
  })

  test('fromUnsignedInteger_invalidValues', () => {
    expect(() => {
      Word.fromUnsignedInteger(-1)
    }).toThrowError(
      'OutOfRange: 32-bit unsigned integer must be an integer in range 0 to 4294967295 (provided: -1).'
    )
    expect(() => {
      Word.fromUnsignedInteger(4294967296)
    }).toThrowError(
      'OutOfRange: 32-bit unsigned integer must be an integer in range 0 to 4294967295 (provided: 4294967296).'
    )
  })
})

describe('fromSignedInteger method', () => {
  test('fromSignedInteger validValues', () => {
    expect(Word.fromSignedInteger(-1).value).toBe(4294967295)
    expect(Word.fromSignedInteger(-122).value).toBe(4294967174)
    expect(Word.fromSignedInteger(8456).value).toBe(8456)
    expect(Word.fromSignedInteger(0).value).toBe(0)
  })

  test('fromSignedInteger invalidValues', () => {
    expect(() => {
      Word.fromSignedInteger(2147483648)
    }).toThrowError(
      'OutOfRange: 32-bit signed integer must be an integer in range -2147483648 to 2147483647 (provided: 2147483648).'
    )
    expect(() => {
      Word.fromSignedInteger(-2147483649)
    }).toThrowError(
      'OutOfRange: 32-bit signed integer must be an integer in range -2147483648 to 2147483647 (provided: -2147483649).'
    )
  })
})

test('hasSign', () => {
  expect(word_00000000.hasSign()).toBeFalsy()
  expect(word_00010000.hasSign()).toBeFalsy()
  expect(word_0fffffff.hasSign()).toBeFalsy()
  expect(word_ffffffff.hasSign()).toBeTruthy()
  expect(word_f0000000.hasSign()).toBeTruthy()
  expect(word_f0000001.hasSign()).toBeTruthy()
})

describe('fromBytes method', () => {
  test('fromBytes - valid values', () => {
    expect(
      Word.fromBytes(
        Byte.fromUnsignedInteger(255),
        Byte.fromUnsignedInteger(255),
        Byte.fromUnsignedInteger(255),
        Byte.fromUnsignedInteger(255)
      )
    ).toEqual(word_ffffffff)
    expect(
      Word.fromBytes(
        Byte.fromUnsignedInteger(0),
        Byte.fromUnsignedInteger(0),
        Byte.fromUnsignedInteger(0),
        Byte.fromUnsignedInteger(0)
      )
    ).toEqual(word_00000000)
    expect(
      Word.fromBytes(
        Byte.fromUnsignedInteger(255),
        Byte.fromUnsignedInteger(255),
        Byte.fromUnsignedInteger(255),
        Byte.fromUnsignedInteger(15)
      )
    ).toEqual(word_0fffffff)
  })
  test('fromBytes - invalid values', () => {
    expect(() =>
      Word.fromBytes(
        Byte.fromUnsignedInteger(255),
        Byte.fromUnsignedInteger(255),
        Byte.fromUnsignedInteger(255),
        Byte.fromUnsignedInteger(255),
        Byte.fromUnsignedInteger(255)
      )
    ).toThrowError('too many bytes for type provided')
  })
})

test('fromHalfwords', () => {
  expect(
    Word.fromHalfwords(
      Halfword.fromUnsignedInteger(65535),
      Halfword.fromUnsignedInteger(65535)
    )
  ).toEqual(word_ffffffff)
  expect(
    Word.fromHalfwords(
      Halfword.fromUnsignedInteger(0),
      Halfword.fromUnsignedInteger(0)
    )
  ).toEqual(word_00000000)
  expect(
    Word.fromHalfwords(
      Halfword.fromUnsignedInteger(65535),
      Halfword.fromUnsignedInteger(4095)
    )
  ).toEqual(word_0fffffff)
})

describe('add method', () => {
  test('add - valid values', () => {
    expect(word_00010000.add(2)).toEqual(Word.fromUnsignedInteger(65538))
    expect(word_0fffffff.add(0xf0007000)).toEqual(
      Word.fromUnsignedInteger(0x00006fff)
    )
    expect(word_0fffffff.add(word_0fffffff)).toEqual(
      Word.fromUnsignedInteger(0x1ffffffe)
    )
    expect(word_ffffffff.add(word_00010000)).toEqual(
      Word.fromUnsignedInteger(0xffff)
    )
  })
  test('add - to big number added (no longer in safe integer range)', () => {
    expect(() => word_ffffffff.add(Math.pow(2, 54))).toThrowError(
      'addition result is not within safe integer range'
    )
  })
})

test('toUnsignedInteger', () => {
  expect(word_ffffffff.toUnsignedInteger()).toBe(4294967295)
  expect(word_00000000.toUnsignedInteger()).toBe(0)
  expect(word_00010000.toUnsignedInteger()).toBe(65536)
})

test('toSignedInteger', () => {
  expect(word_ffffffff.toSignedInteger()).toBe(-1)
  expect(word_00000000.toSignedInteger()).toBe(0)
  expect(word_00010000.toSignedInteger()).toBe(65536)
  expect(word_0fffffff.toSignedInteger()).toBe(268435455)
  expect(word_f0000000.toSignedInteger()).toBe(-268435456)
  expect(word_f0000001.toSignedInteger()).toBe(-268435455)
})

test('toBytes', () => {
  expect(word_ffffffff.toBytes()).toEqual([
    Byte.fromUnsignedInteger(255),
    Byte.fromUnsignedInteger(255),
    Byte.fromUnsignedInteger(255),
    Byte.fromUnsignedInteger(255)
  ])
  expect(word_0fffffff.toBytes()).toEqual([
    Byte.fromUnsignedInteger(255),
    Byte.fromUnsignedInteger(255),
    Byte.fromUnsignedInteger(255),
    Byte.fromUnsignedInteger(15)
  ])
  expect(word_f0000000.toBytes()).toEqual([
    Byte.fromUnsignedInteger(0),
    Byte.fromUnsignedInteger(0),
    Byte.fromUnsignedInteger(0),
    Byte.fromUnsignedInteger(240)
  ])
  expect(word_00010000.toBytes()).toEqual([
    Byte.fromUnsignedInteger(0),
    Byte.fromUnsignedInteger(0),
    Byte.fromUnsignedInteger(1),
    Byte.fromUnsignedInteger(0)
  ])
})

test('toHalfwords', () => {
  expect(word_ffffffff.toHalfwords()).toEqual([
    Halfword.fromUnsignedInteger(65535),
    Halfword.fromUnsignedInteger(65535)
  ])
  expect(word_0fffffff.toHalfwords()).toEqual([
    Halfword.fromUnsignedInteger(65535),
    Halfword.fromUnsignedInteger(4095)
  ])
  expect(word_f0000000.toHalfwords()).toEqual([
    Halfword.fromUnsignedInteger(0),
    Halfword.fromUnsignedInteger(61440)
  ])
  expect(word_00010000.toHalfwords()).toEqual([
    Halfword.fromUnsignedInteger(0),
    Halfword.fromUnsignedInteger(1)
  ])
})

test('toBinaryString', () => {
  expect(word_ffffffff.toBinaryString()).toBe(
    '11111111111111111111111111111111'
  )
  expect(word_00000000.toBinaryString()).toBe(
    '00000000000000000000000000000000'
  )
  expect(word_00010000.toBinaryString()).toBe(
    '00000000000000010000000000000000'
  )
})

test('toHexString', () => {
  expect(word_ffffffff.toHexString()).toBe('ffffffff')
  expect(word_00000000.toHexString()).toBe('00000000')
  expect(word_00010000.toHexString()).toBe('00010000')
})

describe('test isBitSet function', () => {
  test('should return if bit is set or not', () => {
    expect(word_ffffffff.isBitSet(31)).toBe(true)
    expect(word_ffffffff.isBitSet(0)).toBe(true)
    expect(word_ffffffff.isBitSet(18)).toBe(true)
    expect(word_00000000.isBitSet(31)).toBe(false)
    expect(word_00000000.isBitSet(0)).toBe(false)
    expect(word_00000000.isBitSet(8)).toBe(false)
    expect(word_00010000.isBitSet(15)).toBe(false)
    expect(word_00010000.isBitSet(16)).toBe(true)
    expect(word_00010000.isBitSet(17)).toBe(false)
    expect(word_f0000001.isBitSet(0)).toBe(true)
    expect(word_f0000001.isBitSet(1)).toBe(false)
    expect(word_f0000001.isBitSet(14)).toBe(false)
    expect(word_f0000001.isBitSet(27)).toBe(false)
    expect(word_f0000001.isBitSet(28)).toBe(true)
  })
  test('should throw error if out of range', () => {
    let systemError = new Error(
      'bit offset (tried to access) is not within type range'
    )
    expect(() => word_00010000.isBitSet(32)).toThrow(systemError)
    expect(() => word_00010000.isBitSet(66)).toThrow(systemError)
    expect(() => word_00010000.isBitSet(-1)).toThrow(systemError)
  })
})

describe('test setBit function', () => {
  test('set bit where already set', () => {
    expect(word_ffffffff.setBit(31)).toEqual(word_ffffffff)
    expect(word_ffffffff.setBit(0)).toEqual(word_ffffffff)
    expect(word_ffffffff.setBit(18)).toEqual(word_ffffffff)
    expect(word_00010000.setBit(16)).toEqual(word_00010000)
    expect(word_f0000001.setBit(0)).toEqual(word_f0000001)
    expect(word_f0000001.setBit(28)).toEqual(word_f0000001)
  })
  test('set bit where not set yet', () => {
    expect(word_00000000.setBit(31)).toEqual(
      Word.fromUnsignedInteger(0x80000000)
    )
    expect(word_00000000.setBit(0)).toEqual(
      Word.fromUnsignedInteger(0x00000001)
    )
    expect(word_00000000.setBit(7)).toEqual(
      Word.fromUnsignedInteger(0x00000080)
    )
    expect(word_00010000.setBit(15)).toEqual(
      Word.fromUnsignedInteger(0x00018000)
    )
    expect(word_00010000.setBit(17)).toEqual(
      Word.fromUnsignedInteger(0x00030000)
    )
    expect(word_f0000001.setBit(2)).toEqual(
      Word.fromUnsignedInteger(0xf0000005)
    )
    expect(word_f0000001.setBit(13)).toEqual(
      Word.fromUnsignedInteger(0xf0002001)
    )
    expect(word_f0000001.setBit(27)).toEqual(
      Word.fromUnsignedInteger(0xf8000001)
    )
  })
})

describe('test clearBit function', () => {
  test('clear bit which was set', () => {
    expect(word_ffffffff.clearBit(31)).toEqual(
      Word.fromUnsignedInteger(0x7fffffff)
    )
    expect(word_ffffffff.clearBit(0)).toEqual(
      Word.fromUnsignedInteger(0xfffffffe)
    )
    expect(word_ffffffff.clearBit(22)).toEqual(
      Word.fromUnsignedInteger(0xffbfffff)
    )
    expect(word_00010000.clearBit(16)).toEqual(word_00000000)
    expect(word_f0000001.clearBit(0)).toEqual(word_f0000000)
    expect(word_f0000001.clearBit(30)).toEqual(
      Word.fromUnsignedInteger(0xb0000001)
    )
  })
  test('clear bit which is already 0', () => {
    expect(word_00000000.clearBit(31)).toEqual(word_00000000)
    expect(word_00000000.clearBit(0)).toEqual(word_00000000)
    expect(word_00000000.clearBit(7)).toEqual(word_00000000)
    expect(word_00010000.clearBit(15)).toEqual(word_00010000)
    expect(word_00010000.clearBit(17)).toEqual(word_00010000)
    expect(word_f0000001.clearBit(2)).toEqual(word_f0000001)
    expect(word_f0000001.clearBit(13)).toEqual(word_f0000001)
    expect(word_f0000001.clearBit(23)).toEqual(word_f0000001)
  })
})

describe('test toggleBit function', () => {
  test('toggle and toggle again', () => {
    let result = word_ffffffff.toggleBit(21)
    expect(result).toEqual(Word.fromUnsignedInteger(0xffdfffff))
    expect(result.toggleBit(21)).toEqual(word_ffffffff)
    result = word_00000000.toggleBit(10)
    expect(result).toEqual(Word.fromUnsignedInteger(0x00000400))
    expect(result.toggleBit(10)).toEqual(word_00000000)
  })
})

describe('binaryType functions with invalid values', () => {
  test('getHexCharCount not dividable by 4', () => {
    expect(() => BinaryType.getHexCharCount(3)).toThrowError(
      'provided bit count is not dividable by 4'
    )
    expect(() => BinaryType.getHexCharCount(6)).toThrowError(
      'provided bit count is not dividable by 4'
    )
  })
  test('getByteCount not dividable by 8', () => {
    expect(() => BinaryType.getByteCount(7)).toThrowError(
      'provided bit count is not dividable by 8'
    )
    expect(() => BinaryType.getByteCount(9)).toThrowError(
      'provided bit count is not dividable by 8'
    )
  })
})
