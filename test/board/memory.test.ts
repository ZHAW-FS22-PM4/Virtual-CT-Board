/**
 * Tests the memory representation of the board
*/

import { Memory } from '../../src/board/memory'
import { Byte, Halfword, Word } from '../../src/types/binary'

let memory: Memory = new Memory()

const bytes: Byte[] = [Byte.fromSignedInteger(0x05), Byte.fromUnsignedInteger(0xFF), Byte.fromSignedInteger(0x3C), Byte.fromUnsignedInteger(0x95)]
const addresses: Word[] = [Word.fromUnsignedInteger(0x20000000), Word.fromUnsignedInteger(0x20000001), Word.fromUnsignedInteger(0x20000002), Word.fromUnsignedInteger(0x40000000)]

beforeEach(() => {
    memory = new Memory
    memory.writeWord(addresses[0], Word.fromUnsignedInteger(0x12345678))
    memory.writeWord(addresses[3], Word.fromUnsignedInteger(0xFFFFFFFF))
})

describe('test read functions', () => {
    test('should read byte values from the memory', () => {
        expect(memory.readByte(addresses[0]).toUnsignedInteger()).toBe(0x12)
        expect(memory.readByte(addresses[2]).toUnsignedInteger()).toBe(0x56)
        expect(memory.readByte(addresses[3].increment(2)).toUnsignedInteger()).toBe(0xFF)
    })

    test('should read halfword values from the memory', () => {
        expect(memory.readHalfword(addresses[0]).toUnsignedInteger()).toBe(0x1234)
        expect(memory.readHalfword(addresses[1]).toUnsignedInteger()).toBe(0x3456)
        expect(memory.readHalfword(addresses[2]).toUnsignedInteger()).toBe(0x5678)
    })

    test('should read word values from the memory', () => {
        expect(memory.readWord(addresses[0]).toUnsignedInteger()).toBe(0x12345678)
        expect(memory.readWord(addresses[1]).toUnsignedInteger()).toBe(0x34567800)
        expect(memory.readWord(addresses[3]).toUnsignedInteger()).toBe(0xFFFFFFFF)
        expect(memory.readWord(addresses[3].increment(1)).toUnsignedInteger()).toBe(0xFFFFFF00)
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
            expect(memory.readByte(addresses[0].increment(i)).toUnsignedInteger()).toBe(bytes[i].toUnsignedInteger())
        }
    })

    test('should write halfword values to the memory', () => {
        memory.writeHalfword(addresses[3], Halfword.fromUnsignedInteger(0x1234))
        expect(memory.readHalfword(addresses[3]).toUnsignedInteger()).toBe(0x1234)
        expect(memory.readHalfword(addresses[3].increment(1)).toUnsignedInteger()).toBe(0x34FF)
    })

    test('should write word values to the memory', () => {
        memory.writeWord(addresses[3], Word.fromUnsignedInteger(0x5B84F313))
        expect(memory.readWord(addresses[3]).toUnsignedInteger()).toBe(0x5B84F313)
    })
})

describe('test clear function', () => {
    test('should clear all values in the memory', () => {
        memory.clear()
        addresses.forEach(function (address) {
            expect(memory.readWord(address).toUnsignedInteger()).toBe(0x00)
        })
    })
})
