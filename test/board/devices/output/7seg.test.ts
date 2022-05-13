import { Byte, Halfword, Word } from 'types/binary'
import { SEVENseg } from '../../../../src/board/devices/output/7seg'

const byte_0101_0101: Byte = Byte.fromUnsignedInteger(85)
const byte_1010_1010: Byte = Byte.fromUnsignedInteger(170)
const byte_0000_0000: Byte = Byte.fromUnsignedInteger(0)
const byte_1111_1111: Byte = Byte.fromUnsignedInteger(255)
const byte_fe = Byte.fromUnsignedInteger(254)
const byte_81 = Byte.fromUnsignedInteger(129)
let segs: SEVENseg
let displaye: boolean[] = [false, true, true, true, true, false, false, true]//0111_1001
let displayf: boolean[] = [false, true, true, true, false, false, false, true]//0111_0001
let displayI: boolean[] = [false, false, false, false, false, true, true, false]//0000_0110
let display8: boolean[] = [false, true, true, true, true, true, true, true]//0111_1111

let display0: boolean[] = [false, true, false, true, false, true, false, true]//0101_0101
let display1: boolean[] = [true, false, true, false, true, false, true, false]//1010_1010
let display2: boolean[] = [false, false, false, false, false, false, false, false]//0000_0000
let display3: boolean[] = [true, true, true, true, true, true, true, true]//1111_1111

beforeEach(() => {
  segs = new SEVENseg()
})

test('getDisplay() returns seg state on correct position', () => {

  segs.writeWord(
    segs.startAddress,
    Word.fromBytes(
      byte_0101_0101,
      byte_1010_1010,
      byte_0000_0000,
      byte_1111_1111
    )
  )
  expect(segs.getDisplay(3)).toStrictEqual(display3)
  expect(segs.getDisplay(2)).toStrictEqual(display2)
  expect(segs.getDisplay(1)).toStrictEqual(display1)
  expect(segs.getDisplay(0)).toStrictEqual(display0)
})

test('getDisplay() from binary returns seg state on correct position', () => {
  segs.writeHalfword(
    segs.startAddressBin, Halfword.fromBytes(
      byte_fe,
      byte_81
    ))
  expect(segs.getDisplay(3)).toStrictEqual(display8)
  expect(segs.getDisplay(2)).toStrictEqual(displayI)
  expect(segs.getDisplay(1)).toStrictEqual(displayf)
  expect(segs.getDisplay(0)).toStrictEqual(displaye)
})

test('isOn() throws error when position is out of bounds', () => {
  expect(() => segs.isOn(-1,0)).toThrow(new Error(`Segment -1 Position 0 does not exist.`))
  expect(() => segs.isOn(32,0)).toThrow(new Error(`Segment 32 Position 0 does not exist.`))
})
