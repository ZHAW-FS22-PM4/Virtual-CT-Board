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

test('get colour function', () => {
  let redValue: Halfword = Halfword.fromBytes(byte_1111_1111, byte_1111_1111)
  let greenValue: Halfword = Halfword.fromBytes(byte_1010_1010, byte_1111_1111)
  let blueValue: Halfword = Halfword.fromBytes(byte_0101_0101, byte_0000_0000)

  lcdDisplay.writeHalfword(lcdDisplayAdressRed, redValue)
  lcdDisplay.writeHalfword(lcdDisplayAdressGreen, greenValue)
  lcdDisplay.writeHalfword(lcdDisplayAdressBlue, blueValue)

  expect(lcdDisplay.getColour()[0].value).toBe(redValue.value)
  expect(lcdDisplay.getColour()[1].value).toBe(greenValue.value)
  expect(lcdDisplay.getColour()[2].value).toBe(blueValue.value)
})

test('get display value function', () => {
  expect(lcdDisplay.getDisplayValue(20)).toBe('')
  lcdDisplay.writeByte(
    lcdDisplayAsciiBaseAdress,
    Byte.fromSignedInteger('E'.charCodeAt(0))
  )
  expect(lcdDisplay.getDisplayValue(0)).toBe('E')
})

test('get display value function should throw error with invalid position', () => {
  expect(() => lcdDisplay.getDisplayValue(-1)).toThrow(
    new Error(`Position -1 does not exist.`)
  )
  expect(() => lcdDisplay.getDisplayValue(40)).toThrow(
    new Error(`Position 40 does not exist.`)
  )
})
