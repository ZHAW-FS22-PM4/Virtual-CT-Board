import { Switches } from 'board/devices/input/switches'
import { Byte, Halfword, Word } from 'types/binary'

const block1: Word = Word.fromUnsignedInteger(0x60000200)
const block2: Word = Word.fromUnsignedInteger(0x60000201)
const block3: Word = Word.fromUnsignedInteger(0x60000202)
const block4: Word = Word.fromUnsignedInteger(0x60000203)

const byte_0000_0000: Byte = Byte.fromUnsignedInteger(0)
const byte_0101_0101: Byte = Byte.fromUnsignedInteger(85)
const byte_1010_1010: Byte = Byte.fromUnsignedInteger(170)
const byte_1111_1111: Byte = Byte.fromUnsignedInteger(255)
const halfword_empty: Halfword = Halfword.fromUnsignedInteger(0)
const word_empty: Word = Word.fromUnsignedInteger(0)
let switches: Switches

beforeEach(() => {
  switches = new Switches()
  switches.toggle(0)
  switches.toggle(2)
  switches.toggle(4)
  switches.toggle(6)
  switches.toggle(8)
  switches.toggle(10)
  switches.toggle(12)
  switches.toggle(14)
  switches.toggle(16)
  switches.toggle(18)
  switches.toggle(20)
  switches.toggle(22)
  switches.toggle(24)
  switches.toggle(26)
  switches.toggle(28)
  switches.toggle(30)
})

test('test that switches are set to readonly', () => {
  switches.writeByte(block1, byte_0000_0000)
  switches.writeByte(block2, byte_0000_0000)
  switches.writeByte(block3, byte_0000_0000)
  switches.writeByte(block4, byte_0000_0000)

  expect(switches.readByte(block1)).toEqual(byte_0101_0101)
  expect(switches.readByte(block2)).toEqual(byte_0101_0101)
  expect(switches.readByte(block3)).toEqual(byte_0101_0101)
  expect(switches.readByte(block4)).toEqual(byte_0101_0101)

  switches.writeHalfword(block1, halfword_empty)
  expect(switches.readByte(block1)).toEqual(byte_0101_0101)
  expect(switches.readByte(block2)).toEqual(byte_0101_0101)

  switches.writeWord(block1, word_empty)
  expect(switches.readByte(block1)).toEqual(byte_0101_0101)
  expect(switches.readByte(block2)).toEqual(byte_0101_0101)
  expect(switches.readByte(block3)).toEqual(byte_0101_0101)
  expect(switches.readByte(block4)).toEqual(byte_0101_0101)
})

describe('test isOn() function', () => {
  test('test passing invalid positions to isOn() function', () => {
    expect(() => switches.isOn(32)).toThrow(
      new Error('Position 32 does not exist.')
    )
    expect(() => switches.isOn(-2)).toThrow(
      new Error('Position -2 does not exist.')
    )
  })
  test('test passing valid positions to isOn() function', () => {
    expect(switches.isOn(0)).toBe(true)
    expect(switches.isOn(1)).toBe(false)
    expect(switches.isOn(2)).toBe(true)
    expect(switches.isOn(3)).toBe(false)
    expect(switches.isOn(4)).toBe(true)
    expect(switches.isOn(5)).toBe(false)
    expect(switches.isOn(6)).toBe(true)
    expect(switches.isOn(7)).toBe(false)

    expect(switches.isOn(8)).toBe(true)
    expect(switches.isOn(9)).toBe(false)
    expect(switches.isOn(10)).toBe(true)
    expect(switches.isOn(11)).toBe(false)
    expect(switches.isOn(12)).toBe(true)
    expect(switches.isOn(13)).toBe(false)
    expect(switches.isOn(14)).toBe(true)
    expect(switches.isOn(15)).toBe(false)

    expect(switches.isOn(16)).toBe(true)
    expect(switches.isOn(17)).toBe(false)
    expect(switches.isOn(18)).toBe(true)
    expect(switches.isOn(19)).toBe(false)
    expect(switches.isOn(20)).toBe(true)
    expect(switches.isOn(21)).toBe(false)
    expect(switches.isOn(22)).toBe(true)
    expect(switches.isOn(23)).toBe(false)

    expect(switches.isOn(24)).toBe(true)
    expect(switches.isOn(25)).toBe(false)
    expect(switches.isOn(26)).toBe(true)
    expect(switches.isOn(27)).toBe(false)
    expect(switches.isOn(28)).toBe(true)
    expect(switches.isOn(29)).toBe(false)
    expect(switches.isOn(30)).toBe(true)
    expect(switches.isOn(31)).toBe(false)
  })
})

describe('test set() function', () => {
  test('test passing invalid positions to set() function', () => {
    expect(() => switches.set(32, true)).toThrow(
      new Error('Position 32 does not exist.')
    )
    expect(() => switches.set(-2, false)).toThrow(
      new Error('Position -2 does not exist.')
    )
  })
  test('test passing valid positions to set() function', () => {
    switches.set(1, true)
    switches.set(3, true)
    switches.set(5, true)
    switches.set(7, true)

    switches.set(8, false)
    switches.set(10, false)
    switches.set(12, false)
    switches.set(14, false)

    switches.set(17, true)
    switches.set(19, true)
    switches.set(21, true)
    switches.set(23, true)

    switches.set(24, false)
    switches.set(26, false)
    switches.set(28, false)
    switches.set(30, false)

    expect(switches.readByte(block1)).toEqual(byte_1111_1111)
    expect(switches.readByte(block2)).toEqual(byte_0000_0000)
    expect(switches.readByte(block3)).toEqual(byte_1111_1111)
    expect(switches.readByte(block4)).toEqual(byte_0000_0000)

    expect(switches.isOn(0)).toBe(true)
    expect(switches.isOn(1)).toBe(true)
    expect(switches.isOn(2)).toBe(true)
    expect(switches.isOn(3)).toBe(true)
    expect(switches.isOn(4)).toBe(true)
    expect(switches.isOn(5)).toBe(true)
    expect(switches.isOn(6)).toBe(true)
    expect(switches.isOn(7)).toBe(true)

    expect(switches.isOn(8)).toBe(false)
    expect(switches.isOn(9)).toBe(false)
    expect(switches.isOn(10)).toBe(false)
    expect(switches.isOn(11)).toBe(false)
    expect(switches.isOn(12)).toBe(false)
    expect(switches.isOn(13)).toBe(false)
    expect(switches.isOn(14)).toBe(false)
    expect(switches.isOn(15)).toBe(false)

    expect(switches.isOn(16)).toBe(true)
    expect(switches.isOn(17)).toBe(true)
    expect(switches.isOn(18)).toBe(true)
    expect(switches.isOn(19)).toBe(true)
    expect(switches.isOn(20)).toBe(true)
    expect(switches.isOn(21)).toBe(true)
    expect(switches.isOn(22)).toBe(true)
    expect(switches.isOn(23)).toBe(true)

    expect(switches.isOn(24)).toBe(false)
    expect(switches.isOn(25)).toBe(false)
    expect(switches.isOn(26)).toBe(false)
    expect(switches.isOn(27)).toBe(false)
    expect(switches.isOn(28)).toBe(false)
    expect(switches.isOn(29)).toBe(false)
    expect(switches.isOn(30)).toBe(false)
    expect(switches.isOn(31)).toBe(false)
  })
  test('test passing the same value to set() function again', () => {
    switches.set(1, true)
    expect(switches.isOn(1)).toBe(true)
    switches.set(1, true)
    expect(switches.isOn(1)).toBe(true)
  })
})

describe('test toggle() function', () => {
  test('test passing invalid positions to toggle() function', () => {
    expect(() => switches.toggle(32)).toThrow(
      new Error('Position 32 does not exist.')
    )
    expect(() => switches.toggle(-2)).toThrow(
      new Error('Position -2 does not exist.')
    )
  })
  test('test passing valid positions to toggle() function', () => {
    switches.toggle(0)
    switches.toggle(1)
    switches.toggle(2)
    switches.toggle(3)
    switches.toggle(4)
    switches.toggle(5)
    switches.toggle(6)
    switches.toggle(7)

    switches.toggle(8)
    switches.toggle(9)
    switches.toggle(10)
    switches.toggle(11)
    switches.toggle(12)
    switches.toggle(13)
    switches.toggle(14)
    switches.toggle(15)

    switches.toggle(16)
    switches.toggle(17)
    switches.toggle(18)
    switches.toggle(19)
    switches.toggle(20)
    switches.toggle(21)
    switches.toggle(22)
    switches.toggle(23)

    switches.toggle(24)
    switches.toggle(25)
    switches.toggle(26)
    switches.toggle(27)
    switches.toggle(28)
    switches.toggle(29)
    switches.toggle(30)
    switches.toggle(31)

    expect(switches.readByte(block1)).toEqual(byte_1010_1010)
    expect(switches.readByte(block2)).toEqual(byte_1010_1010)
    expect(switches.readByte(block3)).toEqual(byte_1010_1010)
    expect(switches.readByte(block4)).toEqual(byte_1010_1010)

    expect(switches.isOn(0)).toBe(false)
    expect(switches.isOn(1)).toBe(true)
    expect(switches.isOn(2)).toBe(false)
    expect(switches.isOn(3)).toBe(true)
    expect(switches.isOn(4)).toBe(false)
    expect(switches.isOn(5)).toBe(true)
    expect(switches.isOn(6)).toBe(false)
    expect(switches.isOn(7)).toBe(true)

    expect(switches.isOn(8)).toBe(false)
    expect(switches.isOn(9)).toBe(true)
    expect(switches.isOn(10)).toBe(false)
    expect(switches.isOn(11)).toBe(true)
    expect(switches.isOn(12)).toBe(false)
    expect(switches.isOn(13)).toBe(true)
    expect(switches.isOn(14)).toBe(false)
    expect(switches.isOn(15)).toBe(true)

    expect(switches.isOn(16)).toBe(false)
    expect(switches.isOn(17)).toBe(true)
    expect(switches.isOn(18)).toBe(false)
    expect(switches.isOn(19)).toBe(true)
    expect(switches.isOn(20)).toBe(false)
    expect(switches.isOn(21)).toBe(true)
    expect(switches.isOn(22)).toBe(false)
    expect(switches.isOn(23)).toBe(true)

    expect(switches.isOn(24)).toBe(false)
    expect(switches.isOn(25)).toBe(true)
    expect(switches.isOn(26)).toBe(false)
    expect(switches.isOn(27)).toBe(true)
    expect(switches.isOn(28)).toBe(false)
    expect(switches.isOn(29)).toBe(true)
    expect(switches.isOn(30)).toBe(false)
    expect(switches.isOn(31)).toBe(true)
  })
})
