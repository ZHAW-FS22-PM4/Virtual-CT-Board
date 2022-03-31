import { Halfword } from 'types/binary'
import { Byte } from 'types/binary'

const halfword_ffff = Halfword.fromUnsignedInteger(65535)
const halfword_0000 = Halfword.fromUnsignedInteger(0)
const halfword_0100 = Halfword.fromUnsignedInteger(256)
const halfword_00ff = Halfword.fromUnsignedInteger(255)
const halfword_8000 = Halfword.fromUnsignedInteger(32768)
const halfword_8001 = Halfword.fromUnsignedInteger(32769)
const halfword_7fff = Halfword.fromUnsignedInteger(32767)
describe('fromUnsignedInteger method', () => {
  test('fromUnsignedInteger_validValues', () => {
    expect(Halfword.fromUnsignedInteger(65535).value).toBe(65535)
    expect(Halfword.fromUnsignedInteger(255).value).toBe(255)
    expect(Halfword.fromUnsignedInteger(256).value).toBe(256)
    expect(Halfword.fromUnsignedInteger(0).value).toBe(0)
  })

  test('fromUnsignedInteger_invalidValues', () => {
    expect(() => {
      Halfword.fromUnsignedInteger(-1)
    }).toThrowError(
      'OutOfRange: 16-bit unsigned integer must be an integer in range 0 to 65535 (provided: -1).'
    )
    expect(() => {
      Halfword.fromUnsignedInteger(65536)
    }).toThrowError(
      'OutOfRange: 16-bit unsigned integer must be an integer in range 0 to 65535 (provided: 65536).'
    )
  })
})

describe('fromSignedInteger method', () => {
  test('fromSignedInteger validValues', () => {
    expect(Halfword.fromSignedInteger(-1).value).toBe(65535)
    expect(Halfword.fromSignedInteger(-2451).value).toBe(63085)
    expect(Halfword.fromSignedInteger(-32768).value).toBe(32768)
    expect(Halfword.fromSignedInteger(8456).value).toBe(8456)
    expect(Halfword.fromSignedInteger(0).value).toBe(0)
  })

  test('fromSignedInteger invalidValues', () => {
    expect(() => {
      Halfword.fromSignedInteger(32768)
    }).toThrowError(
      'OutOfRange: 16-bit signed integer must be an integer in range -32768 to 32767 (provided: 32768).'
    )
    expect(() => {
      Halfword.fromSignedInteger(-32769)
    }).toThrowError(
      'OutOfRange: 16-bit signed integer must be an integer in range -32768 to 32767 (provided: -32769).'
    )
  })
})

test('hasSign', () => {
  expect(halfword_0000.hasSign()).toBeFalsy()
  expect(halfword_ffff.hasSign()).toBeTruthy()
  expect(halfword_8001.hasSign()).toBeTruthy()
  expect(halfword_8000.hasSign()).toBeTruthy()
  expect(Halfword.fromUnsignedInteger(0x7000).hasSign()).toBeFalsy()
})

test('add', () => {
  expect(halfword_7fff.add(5)).toEqual(Halfword.fromUnsignedInteger(0x8004))
  expect(halfword_7fff.add(0xa030)).toEqual(
    Halfword.fromUnsignedInteger(0x202f)
  )
  expect(halfword_7fff.add(halfword_7fff)).toEqual(
    Halfword.fromUnsignedInteger(0xfffe)
  )
  expect(halfword_ffff.add(halfword_00ff)).toEqual(
    Halfword.fromUnsignedInteger(0xfe)
  )
})

test('toHexString', () => {
  expect(halfword_ffff.toHexString()).toBe('ffff')
  expect(halfword_0000.toHexString()).toBe('0000')
  expect(halfword_0100.toHexString()).toBe('0100')
  expect(halfword_00ff.toHexString()).toBe('00ff')
})

test('toBinaryString', () => {
  expect(halfword_ffff.toBinaryString()).toBe('1111111111111111')
  expect(halfword_0000.toBinaryString()).toBe('0000000000000000')
  expect(halfword_0100.toBinaryString()).toBe('0000000100000000')
  expect(halfword_00ff.toBinaryString()).toBe('0000000011111111')
})

test('toUnsignedInteger', () => {
  expect(halfword_ffff.toUnsignedInteger()).toBe(65535)
  expect(halfword_0000.toUnsignedInteger()).toBe(0)
  expect(halfword_0100.toUnsignedInteger()).toBe(256)
  expect(halfword_00ff.toUnsignedInteger()).toBe(255)
})

test('toSignedInteger', () => {
  expect(halfword_ffff.toSignedInteger()).toBe(-1)
  expect(halfword_7fff.toSignedInteger()).toBe(32767)
  expect(halfword_8001.toSignedInteger()).toBe(-32767)
  expect(halfword_8000.toSignedInteger()).toBe(-32768)
  expect(halfword_0000.toSignedInteger()).toBe(0)
  expect(halfword_0100.toSignedInteger()).toBe(256)
  expect(halfword_00ff.toSignedInteger()).toBe(255)
})

test('toBytes', () => {
  expect(halfword_ffff.toBytes()).toEqual([
    Byte.fromUnsignedInteger(255),
    Byte.fromUnsignedInteger(255)
  ])
  expect(halfword_0100.toBytes()).toEqual([
    Byte.fromUnsignedInteger(0),
    Byte.fromUnsignedInteger(1)
  ])
  expect(halfword_00ff.toBytes()).toEqual([
    Byte.fromUnsignedInteger(255),
    Byte.fromUnsignedInteger(0)
  ])
})

test('fromBytes', () => {
  expect(
    Halfword.fromBytes(
      Byte.fromUnsignedInteger(255),
      Byte.fromUnsignedInteger(255)
    )
  ).toEqual(halfword_ffff)
  expect(
    Halfword.fromBytes(Byte.fromUnsignedInteger(0), Byte.fromUnsignedInteger(0))
  ).toEqual(halfword_0000)
  expect(
    Halfword.fromBytes(
      Byte.fromUnsignedInteger(255),
      Byte.fromUnsignedInteger(127)
    )
  ).toEqual(halfword_7fff)
})

describe('test isBitSet function', () => {
  test('should return if bit is set or not', () => {
    expect(halfword_7fff.isBitSet(15)).toBe(false)
    expect(halfword_7fff.isBitSet(2)).toBe(true)
    expect(halfword_7fff.isBitSet(9)).toBe(true)
    expect(halfword_00ff.isBitSet(8)).toBe(false)
    expect(halfword_0100.isBitSet(0)).toBe(false)
  })
  test('should throw error if out of range', () => {
    let systemError = new Error(
      'bit offset (tried to access) is not within type range'
    )
    expect(() => halfword_8001.isBitSet(16)).toThrow(systemError)
    expect(() => halfword_8001.isBitSet(33)).toThrow(systemError)
    expect(() => halfword_8001.isBitSet(-1)).toThrow(systemError)
  })
})

describe('test setBit function', () => {
  test('should set bit as expected', () => {
    expect(halfword_00ff.setBit(6)).toEqual(halfword_00ff)
    expect(halfword_00ff.setBit(15)).toEqual(
      Halfword.fromUnsignedInteger(0x80ff)
    )
    expect(halfword_8001.setBit(10)).toEqual(
      Halfword.fromUnsignedInteger(0x8401)
    )
    expect(halfword_8001.setBit(2)).toEqual(
      Halfword.fromUnsignedInteger(0x8005)
    )
    expect(halfword_00ff.setBit(7)).toEqual(halfword_00ff)
  })
})

describe('test clearBit function', () => {
  test('should clear bit as expected', () => {
    expect(halfword_00ff.clearBit(7)).toEqual(
      Halfword.fromUnsignedInteger(0x007f)
    )
    expect(halfword_00ff.clearBit(0)).toEqual(
      Halfword.fromUnsignedInteger(0xfe)
    )
    expect(halfword_00ff.clearBit(11)).toEqual(halfword_00ff)
    expect(halfword_7fff.clearBit(9)).toEqual(
      Halfword.fromUnsignedInteger(0x7dff)
    )
    expect(halfword_00ff.clearBit(15)).toEqual(halfword_00ff)
  })
})

describe('test toggleBit function', () => {
  test('toggle and toggle again', () => {
    let result = halfword_0000.toggleBit(12)
    expect(result).toEqual(Halfword.fromUnsignedInteger(0x1000))
    expect(result.toggleBit(12)).toEqual(halfword_0000)
    result = halfword_ffff.toggleBit(2)
    expect(result).toEqual(Halfword.fromUnsignedInteger(0xfffb))
    expect(result.toggleBit(2)).toEqual(halfword_ffff)
  })
})
