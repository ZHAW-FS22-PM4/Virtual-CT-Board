import { SevenSegmentDevice } from 'board/devices/output/seven-segment'
import { Byte, Halfword, Word } from 'types/binary'

const seg_0 = [false, false, true, true, true, true, true, true]
const seg_1 = [false, false, false, false, false, true, true, false]
const seg_2 = [false, true, false, true, true, false, true, true]
const seg_3 = [false, true, false, false, true, true, true, true]
const seg_4 = [false, true, true, false, false, true, true, false]
const seg_5 = [false, true, true, false, true, true, false, true]
const seg_6 = [false, true, true, true, true, true, false, true]
const seg_7 = [false, false, false, false, false, true, true, true]
const seg_8 = [false, true, true, true, true, true, true, true]
const seg_9 = [false, true, true, false, true, true, true, true]
const seg_a = [false, true, true, true, false, true, true, true]
const seg_b = [false, true, true, true, true, true, false, false]
const seg_c = [false, false, true, true, true, false, false, true]
const seg_d = [false, true, false, true, true, true, true, false]
const seg_e = [false, true, true, true, true, false, false, true]
const seg_f = [false, true, true, true, false, false, false, true]

let device: SevenSegmentDevice

const addrSeg1 = Word.fromUnsignedInteger(0x60000110)
const addrSeg2 = Word.fromUnsignedInteger(0x60000111)
const addrSeg3 = Word.fromUnsignedInteger(0x60000112)
const addrSeg4 = Word.fromUnsignedInteger(0x60000113)

const addrBin1 = Word.fromUnsignedInteger(0x60000114)
const addrBin2 = Word.fromUnsignedInteger(0x60000115)

function boolArray(input: string): boolean[] {
  let output = []
  for (let i = 0; i < 8; i++) {
    output[i] = input.charAt(i) === '1'
  }
  return output
}

beforeEach(() => {
  device = new SevenSegmentDevice()
})

describe('test passing of invalid arguments to getDisplay function', () => {
  it('should throw exception if invalid arguments are passed to the function', () => {
    expect(() => device.getDisplay(-1)).toThrow(Error)
    expect(() => device.getDisplay(4)).toThrow(Error)
  })
})

describe('initialization state of seven segment display', () => {
  it('should not return anything if nothing was written to the display yet', () => {
    expect(device.getDisplay(0)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(1)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(2)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(3)).toStrictEqual(boolArray('00000000'))
  })
  it('should not return anything if segment display was written once but in is in segment control mode', () => {
    device.writeByte(addrSeg1, Byte.fromUnsignedInteger(0b11111111))
    expect(device.getDisplay(0)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(1)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(2)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(3)).toStrictEqual(boolArray('00000000'))
  })
  it('should return FF for every display if it was written once and is in binary control mode', () => {
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0b11111111))
    expect(device.getDisplay(0)).toStrictEqual(seg_f)
    expect(device.getDisplay(1)).toStrictEqual(seg_f)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
  })
  it('should reset correctly if reset was called', () => {
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0b11111111))
    expect(device.getDisplay(0)).toStrictEqual(seg_f)
    expect(device.getDisplay(1)).toStrictEqual(seg_f)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)

    device.reset()
    expect(device.getDisplay(0)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(1)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(2)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(3)).toStrictEqual(boolArray('00000000'))
  })
})

describe('test control mode detection', () => {
  it('should be in binary control mode since last written byte was inside binary control mode address', () => {
    // even though starting address is in segment control mode
    device.writeWord(addrSeg3, Word.fromUnsignedInteger(0xddccddaa))
    expect(device.getDisplay(0)).toStrictEqual(seg_c)
    expect(device.getDisplay(1)).toStrictEqual(seg_c)
    expect(device.getDisplay(2)).toStrictEqual(seg_d)
    expect(device.getDisplay(3)).toStrictEqual(seg_d)
  })
  it('should switch the mode correctly after sequentual writes', () => {
    device.writeByte(addrSeg1, Byte.fromUnsignedInteger(0b00000000))
    expect(device.getDisplay(0)).toStrictEqual(boolArray('11111111'))
    expect(device.getDisplay(1)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(2)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(3)).toStrictEqual(boolArray('00000000'))
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0xaa))
    expect(device.getDisplay(0)).toStrictEqual(seg_a)
    expect(device.getDisplay(1)).toStrictEqual(seg_a)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
  })
})

describe('test binary control mode', () => {
  it('should return correct value for written byte', () => {
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x00))
    expect(device.getDisplay(0)).toStrictEqual(seg_0)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x01))
    expect(device.getDisplay(0)).toStrictEqual(seg_1)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x02))
    expect(device.getDisplay(0)).toStrictEqual(seg_2)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x03))
    expect(device.getDisplay(0)).toStrictEqual(seg_3)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x04))
    expect(device.getDisplay(0)).toStrictEqual(seg_4)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x05))
    expect(device.getDisplay(0)).toStrictEqual(seg_5)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x06))
    expect(device.getDisplay(0)).toStrictEqual(seg_6)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x07))
    expect(device.getDisplay(0)).toStrictEqual(seg_7)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x08))
    expect(device.getDisplay(0)).toStrictEqual(seg_8)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x09))
    expect(device.getDisplay(0)).toStrictEqual(seg_9)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x0a))
    expect(device.getDisplay(0)).toStrictEqual(seg_a)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x0b))
    expect(device.getDisplay(0)).toStrictEqual(seg_b)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x0c))
    expect(device.getDisplay(0)).toStrictEqual(seg_c)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x0d))
    expect(device.getDisplay(0)).toStrictEqual(seg_d)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x0e))
    expect(device.getDisplay(0)).toStrictEqual(seg_e)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0x0f))
    expect(device.getDisplay(0)).toStrictEqual(seg_f)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
  })
  it('should return correct value for written byte with offset', () => {
    device.writeByte(addrBin2, Byte.fromUnsignedInteger(0xaa))
    expect(device.getDisplay(0)).toStrictEqual(seg_f)
    expect(device.getDisplay(1)).toStrictEqual(seg_f)
    expect(device.getDisplay(2)).toStrictEqual(seg_a)
    expect(device.getDisplay(3)).toStrictEqual(seg_a)
  })
  it('should return correct value for written halfword', () => {
    device.writeHalfword(addrBin1, Halfword.fromUnsignedInteger(0x00))
    expect(device.getDisplay(0)).toStrictEqual(seg_0)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_0)
    expect(device.getDisplay(3)).toStrictEqual(seg_0)
    device.writeHalfword(addrBin1, Halfword.fromUnsignedInteger(0xffff))
    expect(device.getDisplay(0)).toStrictEqual(seg_f)
    expect(device.getDisplay(1)).toStrictEqual(seg_f)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeHalfword(addrBin1, Halfword.fromUnsignedInteger(0xabcd))
    expect(device.getDisplay(0)).toStrictEqual(seg_d)
    expect(device.getDisplay(1)).toStrictEqual(seg_c)
    expect(device.getDisplay(2)).toStrictEqual(seg_b)
    expect(device.getDisplay(3)).toStrictEqual(seg_a)
    device.writeHalfword(addrBin1, Halfword.fromUnsignedInteger(0x1010))
    expect(device.getDisplay(0)).toStrictEqual(seg_0)
    expect(device.getDisplay(1)).toStrictEqual(seg_1)
    expect(device.getDisplay(2)).toStrictEqual(seg_0)
    expect(device.getDisplay(3)).toStrictEqual(seg_1)
  })
  it('should return correct value for written halfword with offset', () => {
    device.writeHalfword(addrBin2, Halfword.fromUnsignedInteger(0xbbaa))
    expect(device.getDisplay(0)).toStrictEqual(seg_f)
    expect(device.getDisplay(1)).toStrictEqual(seg_f)
    expect(device.getDisplay(2)).toStrictEqual(seg_a)
    expect(device.getDisplay(3)).toStrictEqual(seg_a)
  })
  it('should return correct value for written word', () => {
    device.writeWord(addrBin1, Word.fromUnsignedInteger(0x00))
    expect(device.getDisplay(0)).toStrictEqual(seg_0)
    expect(device.getDisplay(1)).toStrictEqual(seg_0)
    expect(device.getDisplay(2)).toStrictEqual(seg_0)
    expect(device.getDisplay(3)).toStrictEqual(seg_0)
    device.writeWord(addrBin1, Word.fromUnsignedInteger(0xffffffff))
    expect(device.getDisplay(0)).toStrictEqual(seg_f)
    expect(device.getDisplay(1)).toStrictEqual(seg_f)
    expect(device.getDisplay(2)).toStrictEqual(seg_f)
    expect(device.getDisplay(3)).toStrictEqual(seg_f)
    device.writeWord(addrBin1, Word.fromUnsignedInteger(0xabababab))
    expect(device.getDisplay(0)).toStrictEqual(seg_b)
    expect(device.getDisplay(1)).toStrictEqual(seg_a)
    expect(device.getDisplay(2)).toStrictEqual(seg_b)
    expect(device.getDisplay(3)).toStrictEqual(seg_a)
  })
  it('should not override address that exceed address limit', () => {
    device.writeWord(addrBin1, Word.fromUnsignedInteger(0xddccbbaa))
    expect(device.readByte(addrBin1)).toStrictEqual(
      Byte.fromUnsignedInteger(0xaa)
    )
    expect(device.readByte(addrBin2)).toStrictEqual(
      Byte.fromUnsignedInteger(0xbb)
    )

    // these should actually be 0xFF but our board is initialized with 0x00
    expect(device.readByte(addrBin2.add(1))).toStrictEqual(
      Byte.fromUnsignedInteger(0x0)
    )
    expect(device.readByte(addrBin2.add(1).add(1))).toStrictEqual(
      Byte.fromUnsignedInteger(0x0)
    )
  })
})

describe('test segment control mode', () => {
  it('should return correct value for written byte', () => {
    device.writeByte(addrSeg1, Byte.fromUnsignedInteger(0b00110011))
    expect(device.getDisplay(0)).toStrictEqual(boolArray('11001100'))
    expect(device.getDisplay(1)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(2)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(3)).toStrictEqual(boolArray('00000000'))
  })
  it('should return correct value for written half word', () => {
    device.writeHalfword(
      addrSeg1,
      Halfword.fromUnsignedInteger(0b0011001100110011)
    )
    expect(device.getDisplay(0)).toStrictEqual(boolArray('11001100'))
    expect(device.getDisplay(1)).toStrictEqual(boolArray('11001100'))
    expect(device.getDisplay(2)).toStrictEqual(boolArray('00000000'))
    expect(device.getDisplay(3)).toStrictEqual(boolArray('00000000'))
  })
  it('should return correct value for written word', () => {
    device.writeWord(addrSeg1, Word.fromUnsignedInteger(0x33333333))
    expect(device.getDisplay(0)).toStrictEqual(boolArray('11001100'))
    expect(device.getDisplay(1)).toStrictEqual(boolArray('11001100'))
    expect(device.getDisplay(2)).toStrictEqual(boolArray('11001100'))
    expect(device.getDisplay(3)).toStrictEqual(boolArray('11001100'))
  })
})

describe('test vice-versa mapping of addresses', () => {
  it('should reflect mappings from seg to bin addresses', () => {
    device.writeByte(addrSeg1, Byte.fromUnsignedInteger(0xaa))
    device.writeByte(addrSeg2, Byte.fromUnsignedInteger(0xbb))
    expect(device.readByte(addrBin1)).toStrictEqual(
      Byte.fromUnsignedInteger(0xaa)
    )
    expect(device.readByte(addrBin2)).toStrictEqual(
      Byte.fromUnsignedInteger(0xbb)
    )
  })
  it('should reflect mappings from bin to seg addresses', () => {
    device.writeByte(addrBin1, Byte.fromUnsignedInteger(0xaa))
    device.writeByte(addrBin2, Byte.fromUnsignedInteger(0xbb))
    expect(device.readByte(addrSeg1)).toStrictEqual(
      Byte.fromUnsignedInteger(0xaa)
    )
    expect(device.readByte(addrSeg2)).toStrictEqual(
      Byte.fromUnsignedInteger(0xbb)
    )
  })
  it('should reflect mappings of addresses with word', () => {
    device.writeWord(addrSeg2, Word.fromUnsignedInteger(0xddccbbaa))
    expect(device.readByte(addrSeg1)).toStrictEqual(
      Byte.fromUnsignedInteger(0xdd)
    )
    expect(device.readByte(addrSeg2)).toStrictEqual(
      Byte.fromUnsignedInteger(0xaa)
    )
    expect(device.readByte(addrSeg3)).toStrictEqual(
      Byte.fromUnsignedInteger(0xbb)
    )
    expect(device.readByte(addrSeg4)).toStrictEqual(
      Byte.fromUnsignedInteger(0xcc)
    )
    expect(device.readByte(addrBin1)).toStrictEqual(
      Byte.fromUnsignedInteger(0xdd)
    )
    expect(device.readByte(addrBin2)).toStrictEqual(
      Byte.fromUnsignedInteger(0xaa)
    )
  })
})
