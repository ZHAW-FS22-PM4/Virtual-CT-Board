/**
 * Tests the bus of the board
 */
import { Device } from '../../../src/board/devices/device'
import { LEDDevice } from '../../../src/board/devices/output/leds'
import { MemoryBus } from '../../../src/board/memory/bus'
import { Byte, Halfword, Word } from '../../../src/types/binary'

let device: Device
let bus: MemoryBus
let validAddress: Word = Word.fromUnsignedInteger(0x60000100)
let invalidAddress: Word = Word.fromUnsignedInteger(0x50000100)
let byte1: Byte = Byte.fromUnsignedInteger(11)
let byte2: Byte = Byte.fromUnsignedInteger(11)
let halfword1: Halfword = Halfword.fromUnsignedInteger(123)
let word1: Word = Word.fromUnsignedInteger(123456)

beforeEach(() => {
  device = new LEDDevice()
  bus = new MemoryBus([device])
})

describe('test write and read byte functions', () => {
  test('should write and read byte correctly', () => {
    bus.writeByte(validAddress, byte1)
    expect(device.readByte(validAddress)).toEqual(byte1)
    expect(bus.readByte(validAddress)).toEqual(byte1)
  })
  test('should write and read multiple bytes correctly', () => {
    bus.writeBytes(validAddress, [byte1, byte2])
    expect(device.readByte(validAddress)).toEqual(byte1)
    expect(device.readByte(validAddress.add(1))).toEqual(byte2)
  })
})

describe('test write and read halfword functions', () => {
  test('should write and read halfwords correctly', () => {
    bus.writeHalfword(validAddress, halfword1)
    expect(device.readHalfword(validAddress)).toEqual(halfword1)
    expect(bus.readHalfword(validAddress)).toEqual(halfword1)
  })
})

describe('test write and read word functions', () => {
  test('should write and read word correctly', () => {
    bus.writeWord(validAddress, word1)
    expect(device.readWord(validAddress)).toEqual(word1)
    expect(bus.readWord(validAddress)).toEqual(word1)
  })
})

describe('test error when device does not exist', () => {
  test('if error is thrown when invalid is passed', () => {
    expect(() => bus.writeWord(invalidAddress, word1)).toThrow(
      `Could not find a device responsible for the address '0x${invalidAddress.toHexString()}'.`
    )
  })
})
