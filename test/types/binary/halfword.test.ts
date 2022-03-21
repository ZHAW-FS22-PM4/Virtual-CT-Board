import { Halfword } from 'types/binary'
import { Byte } from 'types/binary'


const halfword_ffff = Halfword.fromUnsignedInteger(65535)
const halfword_0000 = Halfword.fromUnsignedInteger(0)
const halfword_0100 = Halfword.fromUnsignedInteger(256)
const halfword_00ff = Halfword.fromUnsignedInteger(255)
const halfword_8000 = Halfword.fromUnsignedInteger(32768)
const halfword_8001 = Halfword.fromUnsignedInteger(32769)
const halfword_7fff = Halfword.fromUnsignedInteger(32767)

test("fromUnsignedInteger_validValues", ()=> {
    expect(Halfword.fromUnsignedInteger(65535).value).toBe(65535)
    expect(Halfword.fromUnsignedInteger(255).value).toBe(255)
    expect(Halfword.fromUnsignedInteger(256).value).toBe(256)
    expect(Halfword.fromUnsignedInteger(0).value).toBe(0)
})

test("fromUnsignedInteger_invalidValues", ()=> {
    expect(() => {
        Halfword.fromUnsignedInteger(-1)
    }).toThrowError("Halfword value can not be smaller than `Halfword.MIN_VALUE`.")
    expect(() => {
        Halfword.fromUnsignedInteger(65536)
    }).toThrowError("Halfword value can not be larger than `Halfword.MAX_VALUE`.")
})


test("toHexString", ()=> {
    expect(halfword_ffff.toHexString()).toBe("ffff")
    expect(halfword_0000.toHexString()).toBe("0000")
    expect(halfword_0100.toHexString()).toBe("0100")
    expect(halfword_00ff.toHexString()).toBe("00ff")
})

test("toBinaryString", ()=> {
    expect(halfword_ffff.toBinaryString()).toBe("1111111111111111")
    expect(halfword_0000.toBinaryString()).toBe("0000000000000000")
    expect(halfword_0100.toBinaryString()).toBe("0000000100000000")
    expect(halfword_00ff.toBinaryString()).toBe("0000000011111111")
})

test("toUnsignedInteger", ()=> {
    expect(halfword_ffff.toUnsignedInteger()).toBe(65535)
    expect(halfword_0000.toUnsignedInteger()).toBe(0)
    expect(halfword_0100.toUnsignedInteger()).toBe(256)
    expect(halfword_00ff.toUnsignedInteger()).toBe(255)
})

test("toSignedInteger", ()=> {
    expect(halfword_ffff.toSignedInteger()).toBe(-1)
    expect(halfword_7fff.toSignedInteger()).toBe(32767)
    expect(halfword_8001.toSignedInteger()).toBe(-32767)
    expect(halfword_8000.toSignedInteger()).toBe(-32768)
    expect(halfword_0000.toSignedInteger()).toBe(0)
    expect(halfword_0100.toSignedInteger()).toBe(256)
    expect(halfword_00ff.toSignedInteger()).toBe(255)
})

test("toBytes_singleByte", ()=> {
    expect(halfword_ffff.toBytes()).toEqual([Byte.fromUnsignedInteger(255), Byte.fromUnsignedInteger(255)])
    expect(halfword_0100.toBytes()).toEqual([Byte.fromUnsignedInteger(0), Byte.fromUnsignedInteger(1)])
    expect(halfword_00ff.toBytes()).toEqual([Byte.fromUnsignedInteger(255)])
})

test("fromBytes", ()=> {
    expect(Halfword.fromBytes(Byte.fromUnsignedInteger(255),Byte.fromUnsignedInteger(255))).toEqual(halfword_ffff)
    expect(Halfword.fromBytes(Byte.fromUnsignedInteger(0),Byte.fromUnsignedInteger(0))).toEqual(halfword_0000)
    expect(Halfword.fromBytes(Byte.fromUnsignedInteger(255),Byte.fromUnsignedInteger(127))).toEqual(halfword_7fff)
})