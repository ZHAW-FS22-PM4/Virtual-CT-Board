/**
 * Tests the memory representation of the board
 */

import { Byte, Halfword, Word } from 'types/binary'
import { Memory } from 'board/memory'

let memory: Memory = new Memory()

const bytes: Byte[] = [
  Byte.fromSignedInteger(0x05),
  Byte.fromUnsignedInteger(0xff),
  Byte.fromSignedInteger(0x3c),
  Byte.fromUnsignedInteger(0x95)
]
const addresses: Word[] = [
  Word.fromUnsignedInteger(0x20000000),
  Word.fromUnsignedInteger(0x20000001),
  Word.fromUnsignedInteger(0x20000002),
  Word.fromUnsignedInteger(0x40000000)
]

beforeEach(() => {
  memory = new Memory()
  memory.writeWord(addresses[0], Word.fromUnsignedInteger(0x12345678))
  memory.writeWord(addresses[3], Word.fromUnsignedInteger(0xffffffff))
})

describe('test read functions', () => {
  test('should read byte values from the memory', () => {
    expect(memory.readByte(addresses[0]).toUnsignedInteger()).toBe(0x78)
    expect(memory.readByte(addresses[2]).toUnsignedInteger()).toBe(0x34)
    expect(memory.readByte(addresses[3].add(2)).toUnsignedInteger()).toBe(0xff)
  })
  test('should read halfword values from the memory', () => {
    expect(memory.readHalfword(addresses[0]).toUnsignedInteger()).toBe(0x5678)
    expect(memory.readHalfword(addresses[1]).toUnsignedInteger()).toBe(0x3456)
    expect(memory.readHalfword(addresses[2]).toUnsignedInteger()).toBe(0x1234)
  })
  test('should read word values from the memory', () => {
    expect(memory.readWord(addresses[0]).toUnsignedInteger()).toBe(0x12345678)
    expect(memory.readWord(addresses[1]).toUnsignedInteger()).toBe(0x00123456)
    expect(memory.readWord(addresses[3]).toUnsignedInteger()).toBe(0xffffffff)
    expect(memory.readWord(addresses[3].add(1)).toUnsignedInteger()).toBe(
      0x00ffffff
    )
  })
})

describe('test write functions', () => {
  test('should write byte values to the memory', () => {
    memory.writeByte(addresses[0], Byte.fromUnsignedInteger(0x87))
    memory.writeByte(addresses[1], Byte.fromUnsignedInteger(0x65))
    memory.writeByte(addresses[2], Byte.fromUnsignedInteger(0x43))

    expect(memory.readByte(addresses[0]).toUnsignedInteger()).toBe(0x87)
    expect(memory.readByte(addresses[1]).toUnsignedInteger()).toBe(0x65)
    expect(memory.readByte(addresses[2]).toUnsignedInteger()).toBe(0x43)
  })
  test('should write multiple byte values to the memory', () => {
    memory.writeBytes(addresses[0], bytes)
    for (let i = 0; i < bytes.length; i++) {
      expect(memory.readByte(addresses[0].add(i)).toUnsignedInteger()).toBe(
        bytes[i].toUnsignedInteger()
      )
    }
  })
  test('should write halfword values to the memory', () => {
    memory.writeHalfword(addresses[3], Halfword.fromUnsignedInteger(0x1234))
    expect(memory.readHalfword(addresses[3]).toUnsignedInteger()).toBe(0x1234)
    expect(memory.readHalfword(addresses[3].add(1)).toUnsignedInteger()).toBe(
      0xff12
    )
  })
  test('should write word values to the memory', () => {
    memory.writeWord(addresses[3], Word.fromUnsignedInteger(0x5b84f313))
    expect(memory.readWord(addresses[3]).toUnsignedInteger()).toBe(0x5b84f313)
  })
})

describe('test reset function', () => {
  test('should reset all values in the memory', () => {
    memory.reset()
    addresses.forEach(function (address) {
      expect(memory.readWord(address).toUnsignedInteger()).toBe(0x00)
    })
  })
})
