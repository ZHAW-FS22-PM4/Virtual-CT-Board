import { HexSwitchDevice } from 'board/devices/input/hex-switch'
import { Byte, Word } from 'types/binary'

const address: Word = Word.fromUnsignedInteger(0x60000211)
const byte_1111_0000: Byte = Byte.fromUnsignedInteger(240)
const byte_1111_1111: Byte = Byte.fromUnsignedInteger(255)

let hexSwitch: HexSwitchDevice

beforeEach(() => {
  hexSwitch = new HexSwitchDevice()
})

describe('test increase() function', () => {
  test('test increase function when original value is zero', () => {
    hexSwitch.increase()
    expect(hexSwitch.readByte(address).value).toBe(241)
  })

  test('test increase function when original value is the max', () => {
    hexSwitch.writeByte(address, byte_1111_1111)
    hexSwitch.increase()
    expect(hexSwitch.readByte(address).value).toBe(byte_1111_1111.value)
  })
})

describe('test decrease() function', () => {
  test('test decrease function when original value is zero', () => {
    hexSwitch.writeByte(address, byte_1111_0000)
    hexSwitch.decrease()
    expect(hexSwitch.readByte(address).value).toBe(byte_1111_0000.value)
  })

  test('test decrease function when original value is the max', () => {
    hexSwitch.writeByte(address, byte_1111_1111)
    hexSwitch.decrease()
    expect(hexSwitch.readByte(address).value).toBe(byte_1111_1111.value - 1)
  })
})

describe('test getHexValue() function', () => {
  test('test get the correct value of the hex address', () => {
    expect(hexSwitch.getHexValue()).toEqual(0)
  })

  test('test get the correct value of the hex address with high value', () => {
    hexSwitch.writeByte(address, byte_1111_1111)
    expect(hexSwitch.getHexValue()).toEqual(15)
  })
})
