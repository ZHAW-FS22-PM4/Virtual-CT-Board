import { Byte } from 'types/binary'
const byte_ff = Byte.fromUnsignedInteger(255)
const byte_00 = Byte.fromUnsignedInteger(0)
const byte_80 = Byte.fromUnsignedInteger(128)
const byte_81 = Byte.fromUnsignedInteger(129)
describe('fromUnsignedInteger method', () => {
  test('fromUnsignedInteger_validValues', () => {
    expect(Byte.fromUnsignedInteger(255).value).toBe(255)
    expect(Byte.fromUnsignedInteger(128).value).toBe(128)
    expect(Byte.fromUnsignedInteger(0).value).toBe(0)
  })

  test('fromUnsignedInteger_invalidValues', () => {
    expect(() => {
      Byte.fromUnsignedInteger(-1)
    }).toThrowError(
      'OutOfRange: 8-bit unsigned integer must be an integer in range 0 to 255 (provided: -1).'
    )
    expect(() => {
      Byte.fromUnsignedInteger(256)
    }).toThrowError(
      'OutOfRange: 8-bit unsigned integer must be an integer in range 0 to 255 (provided: 256).'
    )
  })
})

describe('fromSignedInteger method', () => {
  test('fromSignedInteger validValues', () => {
    expect(Byte.fromSignedInteger(-1).value).toBe(255)
    expect(Byte.fromSignedInteger(-128).value).toBe(128)
    expect(Byte.fromSignedInteger(96).value).toBe(96)
    expect(Byte.fromSignedInteger(0).value).toBe(0)
  })

  test('fromSignedInteger invalidValues', () => {
    expect(() => {
      Byte.fromSignedInteger(128)
    }).toThrowError(
      'OutOfRange: 8-bit signed integer must be an integer in range -128 to 127 (provided: 128).'
    )
    expect(() => {
      Byte.fromSignedInteger(-129)
    }).toThrowError(
      'OutOfRange: 8-bit signed integer must be an integer in range -128 to 127 (provided: -129).'
    )
  })
})

test('hasSign', () => {
  expect(byte_00.hasSign()).toBeFalsy()
  expect(byte_ff.hasSign()).toBeTruthy()
  expect(byte_80.hasSign()).toBeTruthy()
  expect(byte_81.hasSign()).toBeTruthy()
})

test('add', () => {
  expect(byte_80.add(2)).toEqual(Byte.fromUnsignedInteger(130))
  expect(byte_81.add(0x9f)).toEqual(Byte.fromUnsignedInteger(0x20))
  expect(byte_ff.add(0xa6)).toEqual(Byte.fromUnsignedInteger(0xa5))
  expect(byte_81.add(byte_81)).toEqual(Byte.fromUnsignedInteger(0x02))
  expect(byte_81.add(Byte.fromUnsignedInteger(0x9b))).toEqual(
    Byte.fromUnsignedInteger(0x1c)
  )
})

test('toUnsignedInteger', () => {
  expect(byte_ff.toUnsignedInteger()).toBe(255)
  expect(byte_00.toUnsignedInteger()).toBe(0)
  expect(byte_80.toUnsignedInteger()).toBe(128)
  expect(byte_81.toUnsignedInteger()).toBe(129)
})

test('toSignedInteger', () => {
  expect(byte_ff.toSignedInteger()).toBe(-1)
  expect(byte_00.toSignedInteger()).toBe(0)
  expect(byte_80.toSignedInteger()).toBe(-128)
  expect(byte_81.toSignedInteger()).toBe(-127)
})

test('toBinaryString', () => {
  expect(byte_ff.toBinaryString()).toEqual('11111111')
  expect(byte_00.toBinaryString()).toEqual('00000000')
  expect(byte_80.toBinaryString()).toEqual('10000000')
  expect(byte_81.toBinaryString()).toEqual('10000001')
})

test('toHexString', () => {
  expect(byte_ff.toHexString()).toBe('ff')
  expect(byte_00.toHexString()).toBe('00')
  expect(byte_80.toHexString()).toBe('80')
  expect(byte_81.toHexString()).toBe('81')
})
describe('test isBitSet function', () => {
  test('should return if bit is set or not', () => {
    expect(byte_ff.isBitSet(7)).toBe(true)
    expect(byte_ff.isBitSet(2)).toBe(true)
    expect(byte_00.isBitSet(0)).toBe(false)
    expect(byte_00.isBitSet(6)).toBe(false)
  })
  test('should throw error if out of range', () => {
    let systemError = new Error(
      'bit offset (tried to access) is not within type range'
    )
    expect(() => byte_80.isBitSet(8)).toThrow(systemError)
    expect(() => byte_80.isBitSet(33)).toThrow(systemError)
    expect(() => byte_80.isBitSet(-1)).toThrow(systemError)
  })
})

describe('test setBit function', () => {
  test('should set bit as expected', () => {
    expect(byte_ff.setBit(7)).toEqual(byte_ff)
    expect(byte_ff.setBit(0)).toEqual(byte_ff)
    expect(byte_ff.setBit(5)).toEqual(byte_ff)
    expect(byte_00.setBit(7)).toEqual(Byte.fromUnsignedInteger(0x80))
    expect(byte_81.setBit(2)).toEqual(Byte.fromUnsignedInteger(0x85))
    expect(byte_81.setBit(6)).toEqual(Byte.fromUnsignedInteger(0xc1))
  })
})

describe('test clearBit function', () => {
  test('should clear bit as expected', () => {
    expect(byte_ff.clearBit(7)).toEqual(Byte.fromUnsignedInteger(0x7f))
    expect(byte_ff.clearBit(0)).toEqual(Byte.fromUnsignedInteger(0xfe))
    expect(byte_ff.clearBit(4)).toEqual(Byte.fromUnsignedInteger(0xef))
    expect(byte_81.clearBit(7)).toEqual(Byte.fromUnsignedInteger(0x01))
    expect(byte_81.clearBit(0)).toEqual(byte_80)
    expect(byte_80.clearBit(6)).toEqual(byte_80)
    expect(byte_80.clearBit(2)).toEqual(byte_80)
  })
})

describe('test toggleBit function', () => {
  test('toggle and toggle again', () => {
    let result = byte_00.toggleBit(5)
    expect(result).toEqual(Byte.fromUnsignedInteger(0x20))
    expect(result.toggleBit(5)).toEqual(byte_00)
    result = byte_ff.toggleBit(3)
    expect(result).toEqual(Byte.fromUnsignedInteger(0xf7))
    expect(result.toggleBit(3)).toEqual(byte_ff)
  })
})
