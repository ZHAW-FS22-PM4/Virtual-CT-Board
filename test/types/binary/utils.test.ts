import { Byte, Halfword, Word } from 'types/binary'
import {
  checkRange,
  convertToUnsignedNumber,
  getMaxValueDisplayableWithBits,
  limitValuesToBitCount
} from 'types/binary/utils'
import { VirtualBoardError } from 'types/error'

const bitCountErrorMsg =
  'BitCount has to be a positive integer value (at least 1)'
const notSafeIntegerErrorMsg = 'value out of save integer range'
const invalidBitCountErrorMsg =
  'provided bitCount is not an integer between 1 and 32'
describe('checkRange method', () => {
  test('valid ranges', () => {
    expect(checkRange('ANY', 6, 3, 7)).toBeUndefined()
    expect(checkRange('ANY', 178, 178, 178)).toBeUndefined()
    expect(checkRange('ANY', 333333, 0, 333333)).toBeUndefined()
    expect(checkRange('ANY', 2424, 2424, 1000000)).toBeUndefined()
  })
  test('invalid ranges or non integer', () => {
    expect(() => {
      checkRange('INVALID', 0, 1, 10)
    }).toThrowError(VirtualBoardError)
    expect(() => {
      checkRange('INVALID', 234567, 234566, 234566)
    }).toThrowError(VirtualBoardError)
    expect(() => {
      checkRange('INVALID', 456, 100, 150)
    }).toThrowError(VirtualBoardError)
    expect(() => {
      checkRange('INVALID', 5.5, 4, 6)
    }).toThrowError(VirtualBoardError)
  })
})
describe('limitValuesToBitCount method', () => {
  test('limitValuesToBitCount validValues', () => {
    expect(limitValuesToBitCount(8, 3)).toBe(0)
    expect(limitValuesToBitCount(0xfff, 8)).toBe(0xff)
    expect(limitValuesToBitCount(23, 32)).toBe(23)
    expect(limitValuesToBitCount(0x1b237fffdff4ff, 32)).toBe(0xffdff4ff)
    expect(limitValuesToBitCount(-1, 23)).toBe(0x7fffff)
    expect(limitValuesToBitCount(-153, 25)).toBe(0x1ffff67)
  })
  test('limitValuesToBitCount invalidValues', () => {
    expect(() => limitValuesToBitCount(2.3, 3)).toThrowError(
      notSafeIntegerErrorMsg
    )
    expect(() => limitValuesToBitCount(9007199254740992, 3)).toThrowError(
      notSafeIntegerErrorMsg
    ) //2^53
    expect(() => limitValuesToBitCount(0xfff, 33)).toThrowError(
      invalidBitCountErrorMsg
    )
    expect(() => limitValuesToBitCount(23, -63)).toThrowError(
      invalidBitCountErrorMsg
    )
    expect(() => limitValuesToBitCount(23, 5.67)).toThrowError(
      invalidBitCountErrorMsg
    )
  })
})
describe('getMaxValueDisplayableWithBits method', () => {
  test('getMaxValueDisplayableWithBits validValues', () => {
    expect(getMaxValueDisplayableWithBits(8)).toBe(
      Byte.ZERO_BYTE.maxValueForType
    )
    expect(getMaxValueDisplayableWithBits(16)).toBe(
      Halfword.fromUnsignedInteger(0).maxValueForType
    )
    expect(getMaxValueDisplayableWithBits(32)).toBe(
      Word.fromUnsignedInteger(0).maxValueForType
    )
    expect(getMaxValueDisplayableWithBits(18)).toBe(262143)
    expect(getMaxValueDisplayableWithBits(67)).toBe(147573952589676412927)
  })

  test('getMaxValueDisplayableWithBits invalidValues', () => {
    expect(() => {
      getMaxValueDisplayableWithBits(0)
    }).toThrowError(bitCountErrorMsg)
    expect(() => {
      getMaxValueDisplayableWithBits(-6)
    }).toThrowError(bitCountErrorMsg)
    expect(() => {
      getMaxValueDisplayableWithBits(7.83)
    }).toThrowError(bitCountErrorMsg)
    expect(() => {
      getMaxValueDisplayableWithBits(123.009)
    }).toThrowError(bitCountErrorMsg)
  })
})
describe('convertToUnsignedNumber method', () => {
  test('convertToUnsignedNumber validValues', () => {
    expect(convertToUnsignedNumber(1253)).toBe(1253)
    expect(convertToUnsignedNumber(-4)).toBe(4294967292)
  })

  test('convertToUnsignedNumber invalidValues', () => {
    expect(() => {
      convertToUnsignedNumber(2.3)
    }).toThrowError(notSafeIntegerErrorMsg)
    expect(() => {
      convertToUnsignedNumber(2882303452345457892)
    }).toThrowError(notSafeIntegerErrorMsg)
  })
})
