import { LcdDisplay } from 'board/devices/output/lcd'
import { Byte, Halfword, Word } from 'types/binary'

const byte_0101_0101: Byte = Byte.fromUnsignedInteger(85)
const byte_1010_1010: Byte = Byte.fromUnsignedInteger(170)
const byte_0000_0000: Byte = Byte.fromUnsignedInteger(0)
const byte_1111_1111: Byte = Byte.fromUnsignedInteger(255)

const lcdDisplayAdressRed: Word = Word.fromUnsignedInteger(0x60000340)
const lcdDisplayAdressGreen: Word = Word.fromUnsignedInteger(0x60000342)
const lcdDisplayAdressBlue: Word = Word.fromUnsignedInteger(0x60000344)

const lcdDisplayAsciiBaseAdress: Word = Word.fromUnsignedInteger(0x60000300)
const lcdDisplayBinaryBaseAdress: Word = Word.fromUnsignedInteger(0x60000330)

let lcdDisplay: LcdDisplay

beforeEach(() => {
  lcdDisplay = new LcdDisplay()
})

test('get color function', () => {
  let redValue: Halfword = Halfword.fromBytes(byte_1111_1111, byte_1111_1111)
  let greenValue: Halfword = Halfword.fromBytes(byte_1010_1010, byte_1111_1111)
  let blueValue: Halfword = Halfword.fromBytes(byte_0101_0101, byte_0000_0000)

  lcdDisplay.writeHalfword(lcdDisplayAdressRed, redValue)
  lcdDisplay.writeHalfword(lcdDisplayAdressGreen, greenValue)
  lcdDisplay.writeHalfword(lcdDisplayAdressBlue, blueValue)

  expect(lcdDisplay.getColor()[0]).toBe(
    (redValue.value / Halfword.MAX_VALUE) * 255
  )
  expect(lcdDisplay.getColor()[1]).toBe(
    (greenValue.value / Halfword.MAX_VALUE) * 255
  )
  expect(lcdDisplay.getColor()[2]).toBe(
    (blueValue.value / Halfword.MAX_VALUE) * 255
  )
})

test('get display value function', () => {
  expect(lcdDisplay.getDisplayValue(20)).toBe('')
  lcdDisplay.writeByte(
    lcdDisplayAsciiBaseAdress,
    Byte.fromSignedInteger('E'.charCodeAt(0))
  )
  expect(lcdDisplay.getDisplayValue(0)).toBe('E')

  lcdDisplay.writeHalfword(
    lcdDisplayBinaryBaseAdress.add(14),
    Halfword.fromSignedInteger(0x1234)
  )
  expect(lcdDisplay.getDisplayValue(0)).toBe('')
  expect(lcdDisplay.getDisplayValue(1)).toBe('1')
  expect(lcdDisplay.getDisplayValue(2)).toBe('2')
  expect(lcdDisplay.getDisplayValue(3)).toBe('3')
  expect(lcdDisplay.getDisplayValue(4)).toBe('4')
  expect(lcdDisplay.getDisplayValue(5)).toBe('')

  lcdDisplay.writeByte(
    lcdDisplayAsciiBaseAdress.add(1),
    Byte.fromSignedInteger('F'.charCodeAt(0))
  )
  expect(lcdDisplay.getDisplayValue(0)).toBe('E')
  expect(lcdDisplay.getDisplayValue(1)).toBe('F')
  expect(lcdDisplay.getDisplayValue(2)).toBe('')
  expect(lcdDisplay.getDisplayValue(3)).toBe('')
  expect(lcdDisplay.getDisplayValue(4)).toBe('')
  expect(lcdDisplay.getDisplayValue(5)).toBe('')
  expect(lcdDisplay.getDisplayValue(20)).toBe('')

  lcdDisplay.writeWord(
    lcdDisplayBinaryBaseAdress.add(10),
    Word.fromSignedInteger(0x56789012)
  )
  expect(lcdDisplay.getDisplayValue(1)).toBe('F')
  expect(lcdDisplay.getDisplayValue(5)).toBe('')
  expect(lcdDisplay.getDisplayValue(6)).toBe('5')
  expect(lcdDisplay.getDisplayValue(7)).toBe('6')
  expect(lcdDisplay.getDisplayValue(8)).toBe('7')
  expect(lcdDisplay.getDisplayValue(9)).toBe('8')
  expect(lcdDisplay.getDisplayValue(10)).toBe('')
  expect(lcdDisplay.getDisplayValue(11)).toBe('9')
  expect(lcdDisplay.getDisplayValue(12)).toBe('0')
  expect(lcdDisplay.getDisplayValue(13)).toBe('1')
  expect(lcdDisplay.getDisplayValue(14)).toBe('2')
  expect(lcdDisplay.getDisplayValue(15)).toBe('')
})

test('get display value function should throw error with invalid position', () => {
  expect(() => lcdDisplay.getDisplayValue(-1)).toThrow(
    new Error(`Position -1 is not valid.`)
  )
  expect(() => lcdDisplay.getDisplayValue(40)).toThrow(
    new Error(`Position 40 is not valid.`)
  )
})
