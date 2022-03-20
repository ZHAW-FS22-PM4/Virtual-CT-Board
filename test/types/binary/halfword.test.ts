import { Halfword } from 'types/binary'

const halfword_ffff = Halfword.fromUnsignedInteger(65535);
const halfword_0000 = Halfword.fromUnsignedInteger(0);
const halfword_0100 = Halfword.fromUnsignedInteger(256);
const halfword_00ff = Halfword.fromUnsignedInteger(255);
const halfword_8000 = Halfword.fromUnsignedInteger(32768);
const halfword_8001 = Halfword.fromUnsignedInteger(32769);
const halfword_7fff = Halfword.fromUnsignedInteger(32767);




describe("test add function", () => {
    test("fromUnsignedInteger_validValues", ()=> {
        expect(Halfword.fromUnsignedInteger(65535).value).toBe(65535)
        expect(Halfword.fromUnsignedInteger(255).value).toBe(255)
        expect(Halfword.fromUnsignedInteger(256).value).toBe(256)
        expect(Halfword.fromUnsignedInteger(0).value).toBe(0)
    });

    test("fromUnsignedInteger_invalidValues", ()=> {
        expect(() => {
            Halfword.fromUnsignedInteger(-1)
        }).toThrowError("Halfword value can not be smaller than `Halfword.MIN_VALUE`.")
        expect(() => {
            Halfword.fromUnsignedInteger(65536)
        }).toThrowError("Halfword value can not be larger than `Halfword.MAX_VALUE`.")
    });


    test("toHexString", ()=> {
        expect(halfword_ffff.toHexString()).toBe("ffff")
        expect(halfword_0000.toHexString()).toBe("0000")
        expect(halfword_0100.toHexString()).toBe("0100")
        expect(halfword_00ff.toHexString()).toBe("00ff")
    });

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
        expect(halfword_ffff.toSignedInteger()).toBe(-32767)
        expect(halfword_7fff.toSignedInteger()).toBe(32767)
        expect(halfword_8001.toSignedInteger()).toBe(-1)
        //expect(halfword_8000.toSignedInteger()).toBe(-0); // todo: What?!
        expect(halfword_0000.toSignedInteger()).toBe(0)
        expect(halfword_0100.toSignedInteger()).toBe(256)
        expect(halfword_00ff.toSignedInteger()).toBe(255)
    });


})