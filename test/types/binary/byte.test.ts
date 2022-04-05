import { Byte } from 'types/binary'
const byte_ff = Byte.fromUnsignedInteger(255)
const byte_00 = Byte.fromUnsignedInteger(0)
const byte_80 = Byte.fromUnsignedInteger(128)
const byte_81 = Byte.fromUnsignedInteger(129)
const byte_0101_1010 = Byte.fromUnsignedInteger(90)

const byte_0000_0000 = Byte.fromUnsignedInteger(0)
const byte_0000_0001 = Byte.fromUnsignedInteger(1)
const byte_0000_0011 = Byte.fromUnsignedInteger(3)
const byte_0000_0111 = Byte.fromUnsignedInteger(7)
const byte_0000_1111 = Byte.fromUnsignedInteger(15)
const byte_0001_1111 = Byte.fromUnsignedInteger(31)
const byte_0011_1111 = Byte.fromUnsignedInteger(63)
const byte_0111_1111 = Byte.fromUnsignedInteger(127)
const byte_1111_1111 = Byte.fromUnsignedInteger(255)

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

    expect(byte_1111_1111.isBitSet(0)).toBe(true)
    expect(byte_1111_1111.isBitSet(1)).toBe(true)
    expect(byte_1111_1111.isBitSet(2)).toBe(true)
    expect(byte_1111_1111.isBitSet(3)).toBe(true)
    expect(byte_1111_1111.isBitSet(4)).toBe(true)
    expect(byte_1111_1111.isBitSet(5)).toBe(true)
    expect(byte_1111_1111.isBitSet(6)).toBe(true)
    expect(byte_1111_1111.isBitSet(7)).toBe(true)

    expect(byte_0101_1010.isBitSet(0)).toBe(false)
    expect(byte_0101_1010.isBitSet(1)).toBe(true)
    expect(byte_0101_1010.isBitSet(2)).toBe(false)
    expect(byte_0101_1010.isBitSet(3)).toBe(true)
    expect(byte_0101_1010.isBitSet(4)).toBe(true)
    expect(byte_0101_1010.isBitSet(5)).toBe(false)
    expect(byte_0101_1010.isBitSet(6)).toBe(true)
    expect(byte_0101_1010.isBitSet(7)).toBe(false)
  })
  test('should throw error if out of range', () => {
    let systemError = new Error(
      'bit offset (tried to access) is not within type range'
    )
    expect(() => byte_80.isBitSet(8)).toThrow(systemError)
    expect(() => byte_80.isBitSet(33)).toThrow(systemError)
    expect(() => byte_80.isBitSet(-1)).toThrow(systemError)
    expect(() => byte_1111_1111.isBitSet(32)).toThrow(systemError)
    expect(() => byte_1111_1111.isBitSet(66)).toThrow(systemError)
    expect(() => byte_1111_1111.isBitSet(-1)).toThrow(systemError)
  })
})

describe('test setBit function', () => {
  test('set bit where already set', () => {
    expect(byte_ff.setBit(7)).toEqual(byte_ff)
    expect(byte_ff.setBit(0)).toEqual(byte_ff)
    expect(byte_ff.setBit(5)).toEqual(byte_ff)
    expect(byte_1111_1111.setBit(7)).toEqual(byte_1111_1111)
    expect(byte_1111_1111.setBit(0)).toEqual(byte_1111_1111)
    expect(byte_1111_1111.setBit(5)).toEqual(byte_1111_1111)
    expect(byte_0101_1010.setBit(1)).toEqual(byte_0101_1010)
    expect(byte_0101_1010.setBit(3)).toEqual(byte_0101_1010)
    expect(byte_0101_1010.setBit(6)).toEqual(byte_0101_1010)
  })

  test('set bit where not set yet', () => {
    expect(byte_00.setBit(7)).toEqual(Byte.fromUnsignedInteger(0x80))
    expect(byte_81.setBit(2)).toEqual(Byte.fromUnsignedInteger(0x85))
    expect(byte_81.setBit(6)).toEqual(Byte.fromUnsignedInteger(0xc1))
    expect(byte_0000_0000.setBit(0)).toEqual(byte_0000_0001)
    expect(byte_0000_0001.setBit(1)).toEqual(byte_0000_0011)
    expect(byte_0000_0011.setBit(2)).toEqual(byte_0000_0111)
    expect(byte_0000_0111.setBit(3)).toEqual(byte_0000_1111)
    expect(byte_0000_1111.setBit(4)).toEqual(byte_0001_1111)
    expect(byte_0001_1111.setBit(5)).toEqual(byte_0011_1111)
    expect(byte_0011_1111.setBit(6)).toEqual(byte_0111_1111)
    expect(byte_0111_1111.setBit(7)).toEqual(byte_1111_1111)

    let byte: Byte = byte_0101_1010.setBit(0).setBit(2).setBit(5).setBit(7)
    expect(byte).toEqual(byte_1111_1111)
  })
})

describe('test clearBit function', () => {
  test('clear bit where already cleared', () => {
    expect(byte_81.clearBit(0)).toEqual(byte_80)
    expect(byte_80.clearBit(6)).toEqual(byte_80)
    expect(byte_80.clearBit(2)).toEqual(byte_80)
    expect(byte_0000_0000.clearBit(7)).toEqual(byte_0000_0000)
    expect(byte_0000_0000.clearBit(5)).toEqual(byte_0000_0000)
    expect(byte_0000_0000.clearBit(0)).toEqual(byte_0000_0000)
    expect(byte_0101_1010.clearBit(7)).toEqual(byte_0101_1010)
    expect(byte_0101_1010.clearBit(5)).toEqual(byte_0101_1010)
    expect(byte_0101_1010.clearBit(2)).toEqual(byte_0101_1010)
    expect(byte_0101_1010.clearBit(0)).toEqual(byte_0101_1010)
  })

  test('clear bit which was set', () => {
    expect(byte_ff.clearBit(7)).toEqual(Byte.fromUnsignedInteger(0x7f))
    expect(byte_ff.clearBit(0)).toEqual(Byte.fromUnsignedInteger(0xfe))
    expect(byte_ff.clearBit(4)).toEqual(Byte.fromUnsignedInteger(0xef))
    expect(byte_81.clearBit(7)).toEqual(Byte.fromUnsignedInteger(0x01))
    expect(byte_0000_0001.clearBit(0)).toEqual(byte_0000_0000)
    expect(byte_0000_0011.clearBit(1)).toEqual(byte_0000_0001)
    expect(byte_0000_0111.clearBit(2)).toEqual(byte_0000_0011)
    expect(byte_0000_1111.clearBit(3)).toEqual(byte_0000_0111)
    expect(byte_0001_1111.clearBit(4)).toEqual(byte_0000_1111)
    expect(byte_0011_1111.clearBit(5)).toEqual(byte_0001_1111)
    expect(byte_0111_1111.clearBit(6)).toEqual(byte_0011_1111)
    expect(byte_1111_1111.clearBit(7)).toEqual(byte_0111_1111)
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
  test('toggle from 0 to 1', () => {
    expect(byte_0000_0000.toggleBit(0)).toEqual(byte_0000_0001)
    expect(byte_0000_0001.toggleBit(1)).toEqual(byte_0000_0011)
    expect(byte_0000_0011.toggleBit(2)).toEqual(byte_0000_0111)
    expect(byte_0000_0111.toggleBit(3)).toEqual(byte_0000_1111)
    expect(byte_0000_1111.toggleBit(4)).toEqual(byte_0001_1111)
    expect(byte_0001_1111.toggleBit(5)).toEqual(byte_0011_1111)
    expect(byte_0011_1111.toggleBit(6)).toEqual(byte_0111_1111)
    expect(byte_0111_1111.toggleBit(7)).toEqual(byte_1111_1111)
  })

  test('toggle from 1 to 0', () => {
    expect(byte_1111_1111.toggleBit(7)).toEqual(byte_0111_1111)
    expect(byte_0111_1111.toggleBit(6)).toEqual(byte_0011_1111)
    expect(byte_0011_1111.toggleBit(5)).toEqual(byte_0001_1111)
    expect(byte_0001_1111.toggleBit(4)).toEqual(byte_0000_1111)
    expect(byte_0000_1111.toggleBit(3)).toEqual(byte_0000_0111)
    expect(byte_0000_0111.toggleBit(2)).toEqual(byte_0000_0011)
    expect(byte_0000_0011.toggleBit(1)).toEqual(byte_0000_0001)
    expect(byte_0000_0001.toggleBit(0)).toEqual(byte_0000_0000)
  })
})
