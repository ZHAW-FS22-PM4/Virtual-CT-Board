import { Byte } from 'types/binary'
import { Halfword } from 'types/binary'
import { Word } from 'types/binary'

const word_ffffffff = Word.fromUnsignedInteger(4294967295)
const word_00000000 = Word.fromUnsignedInteger(0)
const word_00010000 = Word.fromUnsignedInteger(65536)
const word_0fffffff = Word.fromUnsignedInteger(268435455)
const word_f0000000 = Word.fromUnsignedInteger(4026531840)
const word_f0000001 = Word.fromUnsignedInteger(4026531841)

test("fromUnsignedInteger_validValues", ()=> {
    expect(Word.fromUnsignedInteger(4294967295).value).toBe(4294967295)
    expect(Word.fromUnsignedInteger(65535).value).toBe(65535)
    expect(Word.fromUnsignedInteger(0).value).toBe(0)
})

test("fromUnsignedInteger_invalidValues", ()=> {
    expect(() => {
        Word.fromUnsignedInteger(-1)
    }).toThrowError("Word value can not be smaller than `Word.MIN_VALUE`.")
    expect(() => {
        Word.fromUnsignedInteger(4294967296)
    }).toThrowError("Word value can not be larger than `Word.MAX_VALUE`.")
})

test("fromBytes", ()=> {
})

test("toBytes", ()=> {
})

test("fromHalfwords", ()=> {
})

test("increment", ()=> {
})

test("toUnsignedInteger", ()=> {
        expect(word_ffffffff.toUnsignedInteger()).toBe(4294967295)
    expect(word_00000000.toUnsignedInteger()).toBe(0)
    expect(word_00010000.toUnsignedInteger()).toBe(65536)
})

test("toSignedInteger", ()=> {
    expect(word_ffffffff.toSignedInteger()).toBe(-1)
    expect(word_00000000.toSignedInteger()).toBe(0)
    expect(word_00010000.toSignedInteger()).toBe(65536)
    expect(word_0fffffff.toSignedInteger()).toBe(268435455)
    expect(word_f0000000.toSignedInteger()).toBe(-268435456)
    expect(word_f0000001.toSignedInteger()).toBe(-268435455)


})

test("toBytes", ()=> {
})

test("toHalfwords", ()=> {
    //expect(word_ffffffff.toHalfwords()).toEqual([Halfword.fromUnsignedInteger(65535),Halfword.fromUnsignedInteger(65535)])
    //expect(word_0fffffff.toHalfwords()).toEqual([Halfword.fromUnsignedInteger(65535),Halfword.fromUnsignedInteger(4095)])
    //expect(word_0fffffff.toHalfwords()).toEqual("[Halfword.fromUnsignedInteger(65535),Halfword.fromUnsignedInteger(61440)]")
})

test("toBinaryString", ()=> {
    expect(word_ffffffff.toBinaryString()).toBe("11111111111111111111111111111111")
    expect(word_00000000.toBinaryString()).toBe("00000000000000000000000000000000")
    expect(word_00010000.toBinaryString()).toBe("00000000000000010000000000000000")
})

test("toHexString", ()=> {
    expect(word_ffffffff.toHexString()).toBe("ffffffff")
    expect(word_00000000.toHexString()).toBe("00000000")
    expect(word_00010000.toHexString()).toBe("00010000")
})