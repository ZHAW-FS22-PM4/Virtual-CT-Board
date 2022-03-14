/*
    Represents the memory of the board
*/

import { Word, Halfword, Byte } from 'types/binary'

interface IMemory {
    [address: number]: number
}

let memory: IMemory = {}

export function writeByte(address: Word, byte: Byte): void {
    memory[address.value] = byte.value
}

export function writeBytes(address: Word, bytes: Byte[]): void {
    for (const byte of bytes) {
        writeByte(address, byte)
        address = address.increment(1)
    }
}

export function writeHalfword(address: Word, halfword: Halfword): void {
    writeBytes(address, halfword.toBytes())
}

export function writeWord(address: Word, word: Word): void {
    writeBytes(address, word.toBytes())
}

export function readByte(address: Word): Byte {
    if (address.value in memory) {
        return Byte.fromUnsignedInteger(memory[address.value])
    }
    return Byte.fromUnsignedInteger(0x0)
}

export function readHalfword(address: Word): Halfword {
    return Halfword.fromBytes(
        readByte(address.increment(0)),
        readByte(address.increment(1))
    )
}

export function readWord(address: Word): Word {
    return Word.fromBytes(
        readByte(address.increment(0)),
        readByte(address.increment(1)),
        readByte(address.increment(2)),
        readByte(address.increment(3))
    )
}

export function clearMemory(): void {
    memory = {}
}