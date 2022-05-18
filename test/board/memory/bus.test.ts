/**
 * Tests the bus of the board
 */
import { Device } from 'board/devices/device'
import { MemoryBus } from 'board/memory/bus'
import { anything, instance, mock, verify, when } from 'ts-mockito'
import { Byte, Halfword, Word } from 'types/binary'

let device: Device
let bus: MemoryBus
let validAddress: Word = Word.fromUnsignedInteger(0x60000100)
let invalidAddress: Word = Word.fromUnsignedInteger(0x50000100)
let byte1: Byte = Byte.fromUnsignedInteger(11)
let byte2: Byte = Byte.fromUnsignedInteger(11)
let halfword1: Halfword = Halfword.fromUnsignedInteger(123)
let word1: Word = Word.fromUnsignedInteger(123456)

const deviceMock: Device = mock<Device>()

when(deviceMock.readByte(validAddress)).thenReturn(byte1)
when(deviceMock.isResponsibleFor(anything())).thenReturn(true)
when(deviceMock.isResponsibleFor(invalidAddress)).thenReturn(false)
when(deviceMock.readByte(validAddress.add(1))).thenReturn(byte2)
when(deviceMock.readHalfword(validAddress)).thenReturn(halfword1)
when(deviceMock.readWord(validAddress)).thenReturn(word1)

beforeEach(() => {
  device = instance(deviceMock)
  bus = new MemoryBus([device])
})

describe('test write and read byte functions', () => {
  test('should write and read byte correctly', () => {
    bus.writeByte(validAddress, byte1)
    verify(deviceMock.writeByte(validAddress, byte1)).once()
    expect(bus.readByte(validAddress)).toEqual(byte1)
  })
  test('should write multiple bytes correctly', () => {
    let value: Byte[] = [byte1, byte2]
    bus.writeBytes(validAddress, value)
    verify(deviceMock.writeBytes(validAddress, value)).once()
  })
})

describe('test write and read halfword functions', () => {
  test('should write and read halfwords correctly', () => {
    bus.writeHalfword(validAddress, halfword1)
    verify(deviceMock.writeHalfword(validAddress, halfword1)).once()
    expect(bus.readHalfword(validAddress)).toEqual(halfword1)
  })
})

describe('test write and read word functions', () => {
  test('should write and read word correctly', () => {
    bus.writeWord(validAddress, word1)
    verify(deviceMock.writeWord(validAddress, word1)).once()
    expect(bus.readWord(validAddress)).toEqual(word1)
  })
})

describe('test error when device does not exist', () => {
  test('if error is thrown when invalid device address is passed', () => {
    expect(() => bus.writeWord(invalidAddress, word1)).toThrow(
      `Could not find a device responsible for the address '0x${invalidAddress.toHexString()}'.`
    )
  })
})
