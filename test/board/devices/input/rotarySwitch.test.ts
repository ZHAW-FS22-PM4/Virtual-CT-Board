import { RotarySwitch} from "board/devices/input/rotarySwitch"
import { Byte, Word } from 'types/binary'

const address: Word = Word.fromUnsignedInteger(0x60000211)
const byte_0000_0000: Byte = Byte.fromUnsignedInteger(0)
const byte_0000_0100: Byte = Byte.fromUnsignedInteger(4)
const byte_1111_1111: Byte = Byte.fromUnsignedInteger(255)

let rotarySwitch: RotarySwitch

beforeEach(() => {
  rotarySwitch = new RotarySwitch()
})

describe('test increase() function', () => {
  test('test increase function when original value is zero', () => {
    rotarySwitch.writeByte(address,byte_0000_0000)
    rotarySwitch.increase()
    expect(rotarySwitch.readByte(address).value).toBe(byte_0000_0000.value + 1)
  })

  test('test increase function with normal value', () => {
    rotarySwitch.writeByte(address,byte_0000_0100)
    rotarySwitch.increase()
    expect(rotarySwitch.readByte(address).value).toBe(byte_0000_0100.value + 1)
  })

  test('test increase function when original value is the max', () => {
    rotarySwitch.writeByte(address,byte_1111_1111)
    rotarySwitch.increase()
    expect(rotarySwitch.readByte(address).value).toBe(byte_1111_1111.value)
  })
})

describe('test decrease() function', () => {
  test('test decrease function when original value is zero', () => {
    rotarySwitch.writeByte(address,byte_0000_0000)
    rotarySwitch.decrease()
    expect(rotarySwitch.readByte(address).value).toBe(byte_0000_0000.value)
  })

  test('test decrease function with normal value', () => {
    rotarySwitch.writeByte(address,byte_0000_0100)
    rotarySwitch.decrease()
    expect(rotarySwitch.readByte(address).value).toBe(byte_0000_0100.value - 1)
  })

  test('test decrease function when original value is the max', () => {
    rotarySwitch.writeByte(address,byte_1111_1111)
    rotarySwitch.decrease()
    expect(rotarySwitch.readByte(address).value).toBe(byte_1111_1111.value - 1)
  })
})

describe('test getRotaryValue() function', () => {
  test('test get the correct value of the rotary address', () => {
    rotarySwitch.writeByte(address,byte_0000_0100)
    expect(rotarySwitch.getRotaryValue()).toEqual(byte_0000_0100)
  })
})

