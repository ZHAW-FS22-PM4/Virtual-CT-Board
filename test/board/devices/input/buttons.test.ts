import { Buttons } from 'board/devices/input/buttons'
import { Byte, Word } from 'types/binary'

const address: Word = Word.fromUnsignedInteger(0x60000210)
const byte_0000_0000: Byte = Byte.fromUnsignedInteger(0)
const byte_0000_0101: Byte = Byte.fromUnsignedInteger(5)
const byte_0000_0100: Byte = Byte.fromUnsignedInteger(4)
const byte_0000_1111: Byte = Byte.fromUnsignedInteger(15)

let buttons: Buttons

beforeEach(() => {
  buttons = new Buttons()
  buttons.press(0)
  buttons.press(2)
})

test('test that buttons are set to readonly', () => {
  buttons.writeByte(address, byte_0000_0000)
  expect(buttons.readByte(address)).toEqual(byte_0000_0101)
})

describe('test isPressed() function', () => {
  test('test passing invalid positions to isPressed() function', () => {
    expect(() => buttons.isPressed(4)).toThrow(
      new Error('Button position 4 does not exist.')
    )
    expect(() => buttons.isPressed(-2)).toThrow(
      new Error('Button position -2 does not exist.')
    )
  })
  test('test passing valid positions to isPressed() function', () => {
    expect(buttons.isPressed(0)).toBe(true)
    expect(buttons.isPressed(1)).toBe(false)
    expect(buttons.isPressed(2)).toBe(true)
    expect(buttons.isPressed(3)).toBe(false)
  })
})

describe('test press() function', () => {
  test('test passing invalid positions to press() function', () => {
    expect(() => buttons.press(4)).toThrow(
      new Error('Button position 4 does not exist.')
    )
    expect(() => buttons.press(-2)).toThrow(
      new Error('Button position -2 does not exist.')
    )
  })
  test('test passing valid positions to press() function', () => {
    buttons.press(1)
    buttons.press(3)

    expect(buttons.readByte(address)).toEqual(byte_0000_1111)

    expect(buttons.isPressed(0)).toBe(true)
    expect(buttons.isPressed(1)).toBe(true)
    expect(buttons.isPressed(2)).toBe(true)
    expect(buttons.isPressed(3)).toBe(true)
  })
  test('test passing the same value to press() function again', () => {
    buttons.press(1)
    expect(buttons.isPressed(1)).toBe(true)
    buttons.press(1)
    expect(buttons.isPressed(1)).toBe(true)
  })
})

describe('test release() function', () => {
  test('test passing invalid positions to release() function', () => {
    expect(() => buttons.release(22)).toThrow(
      new Error('Button position 22 does not exist.')
    )
    expect(() => buttons.release(-1)).toThrow(
      new Error('Button position -1 does not exist.')
    )
  })
  test('test passing valid positions to release() function', () => {
    buttons.release(0)
    buttons.release(2)

    expect(buttons.readByte(address)).toEqual(byte_0000_0000)

    expect(buttons.isPressed(0)).toBe(false)
    expect(buttons.isPressed(1)).toBe(false)
    expect(buttons.isPressed(2)).toBe(false)
    expect(buttons.isPressed(3)).toBe(false)
  })
  test('test passing the same value to release() function again', () => {
    buttons.release(0)
    expect(buttons.isPressed(0)).toBe(false)
    expect(buttons.readByte(address)).toEqual(byte_0000_0100)
    buttons.release(0)
    expect(buttons.isPressed(0)).toBe(false)
    expect(buttons.readByte(address)).toEqual(byte_0000_0100)
  })
})
