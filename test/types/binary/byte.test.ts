import { Byte } from 'types/binary'
const byte_ff = Byte.fromUnsignedInteger(255)
const byte_00 = Byte.fromUnsignedInteger(0)
const byte_80 = Byte.fromUnsignedInteger(128)
const byte_81 = Byte.fromUnsignedInteger(129)

test("fromUnsignedInteger_validValues", ()=> {
    expect(Byte.fromUnsignedInteger(255).value).toBe(255)
    expect(Byte.fromUnsignedInteger(128).value).toBe(128)
    expect(Byte.fromUnsignedInteger(0).value).toBe(0)
})

test("fromUnsignedInteger_invalidValues", ()=> {
    expect(() => {
        Byte.fromUnsignedInteger(-1)
    }).toThrowError("OutOfRange: 8-bit signed integer must be an integer in range 0 to 255.")
    expect(() => {
        Byte.fromUnsignedInteger(256)
    }).toThrowError("OutOfRange: 8-bit signed integer must be an integer in range 0 to 255.")
})

test("hasSign", ()=> {
    expect(byte_00.hasSign()).toBeFalsy()
})

test("add", ()=> {
    expect(byte_80.add(2)).toEqual(Byte.fromUnsignedInteger(131))
})

test("toUnsignedInteger", ()=> {
    expect(byte_ff.toUnsignedInteger()).toBe(255)
    expect(byte_00.toUnsignedInteger()).toBe(0)
    expect(byte_80.toUnsignedInteger()).toBe(128)
    expect(byte_81.toUnsignedInteger()).toBe(129)
})

test("toSignedInteger", ()=> {
    expect(byte_ff.toSignedInteger()).toBe(-1)
    expect(byte_00.toSignedInteger()).toBe(0)
    expect(byte_80.toSignedInteger()).toBe(-128)
    expect(byte_81.toSignedInteger()).toBe(-127)
})

test("toBinaryString", ()=> {
    expect(byte_ff.toBinaryString()).toEqual("11111111")
    expect(byte_00.toBinaryString()).toEqual("00000000")
    expect(byte_80.toBinaryString()).toEqual("10000000")
    expect(byte_81.toBinaryString()).toEqual("10000001")
})

test("toHexString", ()=> {
    expect(byte_ff.toHexString()).toBe("ff")
    expect(byte_00.toHexString()).toBe("00")
    expect(byte_80.toHexString()).toBe("80")
    expect(byte_81.toHexString()).toBe("81")
})
