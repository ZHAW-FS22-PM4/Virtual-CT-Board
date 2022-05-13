import { HexSwitchDevice } from 'board/devices/input/hex-switch'
import { Byte, Word } from 'types/binary'

const address: Word = Word.fromUnsignedInteger(0x60000211)
const byte_1111_0000: Byte = Byte.fromUnsignedInteger(240)
const byte_1111_1111: Byte = Byte.fromUnsignedInteger(255)

let rotarySwitch: HexSwitchDevice

beforeEach(() => {
  rotarySwitch = new HexSwitchDevice()
})

describe('test increase() function', () => {
  test('test increase function when original value is zero', () => {
    rotarySwitch.increase()
    expect(rotarySwitch.readByte(address).value).toBe(241)
  })

  test('test increase function when original value is the max', () => {
    rotarySwitch.writeByte(address, byte_1111_1111)
    rotarySwitch.increase()
    expect(rotarySwitch.readByte(address).value).toBe(byte_1111_1111.value)
  })
})

describe('test decrease() function', () => {
  test('test decrease function when original value is zero', () => {
    rotarySwitch.writeByte(address, byte_1111_0000)
    rotarySwitch.decrease()
    expect(rotarySwitch.readByte(address).value).toBe(byte_1111_0000.value)
  })

  test('test decrease function when original value is the max', () => {
    rotarySwitch.writeByte(address, byte_1111_1111)
    rotarySwitch.decrease()
    expect(rotarySwitch.readByte(address).value).toBe(byte_1111_1111.value - 1)
  })
})

describe('test getRotaryValue() function', () => {
  test('test get the correct value of the rotary address', () => {
    expect(rotarySwitch.getRotaryValue()).toEqual(0)
  })

  test('test get the correct value of the rotary address with high value', () => {
    rotarySwitch.writeByte(address, byte_1111_1111)
    expect(rotarySwitch.getRotaryValue()).toEqual(15)
  })
})
