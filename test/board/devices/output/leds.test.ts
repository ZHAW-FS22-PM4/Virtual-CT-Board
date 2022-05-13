import { LEDDevice } from 'board/devices/output/leds'
import { Byte, Word } from 'types/binary'

const byte_0101_0101: Byte = Byte.fromUnsignedInteger(85)
const byte_1010_1010: Byte = Byte.fromUnsignedInteger(170)
const byte_0000_0000: Byte = Byte.fromUnsignedInteger(0)
const byte_1111_1111: Byte = Byte.fromUnsignedInteger(255)

let leds: LEDDevice

beforeEach(() => {
  leds = new LEDDevice()
  leds.writeWord(
    leds.startAddress,
    Word.fromBytes(
      byte_0101_0101,
      byte_1010_1010,
      byte_0000_0000,
      byte_1111_1111
    )
  )
})

test('isOn() returns led state on correct position', () => {
  expect(leds.isOn(0)).toBeTruthy()
  expect(leds.isOn(1)).toBeFalsy()
  expect(leds.isOn(7)).toBeFalsy()
  expect(leds.isOn(8)).toBeFalsy()
  expect(leds.isOn(17)).toBeFalsy()
  expect(leds.isOn(18)).toBeFalsy()
  expect(leds.isOn(30)).toBeTruthy()
  expect(leds.isOn(31)).toBeTruthy()
  leds.reset()
})

test('isOn() throws error when position is out of bounds', () => {
  expect(() => leds.isOn(-1)).toThrow(new Error(`Position -1 does not exist.`))
  expect(() => leds.isOn(32)).toThrow(new Error(`Position 32 does not exist.`))
})

test('resetting turns all leds off', () => {
  leds.reset()
  expect(leds.isOn(0)).toBeFalsy()
  expect(leds.isOn(1)).toBeFalsy()
  expect(leds.isOn(2)).toBeFalsy()
  expect(leds.isOn(3)).toBeFalsy()
  expect(leds.isOn(4)).toBeFalsy()
  expect(leds.isOn(5)).toBeFalsy()
  expect(leds.isOn(6)).toBeFalsy()
  expect(leds.isOn(7)).toBeFalsy()
})
