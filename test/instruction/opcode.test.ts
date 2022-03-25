import { match, create, setBits } from 'instruction/opcode'
import { Halfword } from 'types/binary'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'

describe('match', function () {
  it('should match when equal', function () {
    expect(
      match(
        Halfword.fromUnsignedInteger(0b1100110011001100),
        '1100110011001100'
      )
    ).toBe(true)
  })
  it('should not match when not equal', function () {
    expect(
      match(
        Halfword.fromUnsignedInteger(0b1100110011001100),
        '1100110011001111'
      )
    ).toBe(false)
  })
  it('should ignore masked bits when comparing', function () {
    expect(
      match(
        Halfword.fromUnsignedInteger(0b1100110011111100),
        '1100110011XX11XX'
      )
    ).toBe(true)
  })
  it('should throw when pattern not 16 characters', function () {
    expect(() =>
      match(
        Halfword.fromUnsignedInteger(0b1100110011001100),
        '110011001100110000'
      )
    ).toThrow()
  })
  it('should throw when pattern contains invalid characters', function () {
    expect(() =>
      match(
        Halfword.fromUnsignedInteger(0b1100110011001100),
        '1100110011XZ1123'
      )
    ).toThrow()
  })
})

describe('test create function', function () {
  it('should create a correct opcode from a pattern', function () {
    expect(create('1111111111XXXXXX').toBinaryString()).toBe('1111111111000000')
    expect(create('01010101XXXXXXXX').toBinaryString()).toBe('0101010100000000')
  })

  it('should throw when pattern not 16 characters', function () {
    expect(() => create('1111111111XXXXXXX')).toThrow(VirtualBoardError)
    expect(() => create('11111111XXXXXXX')).toThrow(VirtualBoardError)
  })

  it('should throw when pattern contains invalid characters', function () {
    expect(() => create('1112111111XXXXXX')).toThrow(VirtualBoardError)
  })
})

describe('test setBits function', function () {
  let opcode: Halfword = Halfword.fromUnsignedInteger(0b0011010001110001)
  let value: Halfword = Halfword.fromUnsignedInteger(10)
  it('should set correct bits according to a pattern', function () {
    expect(setBits(opcode, '1111111111XXXXXX', value).toBinaryString()).toBe(
      '0011010001111011'
    )
    expect(setBits(opcode, '01010101010101XX', value).toBinaryString()).toBe(
      '0011010001110011'
    )
    expect(setBits(opcode, 'XX01X0010101010X', value).toBinaryString()).toBe(
      '1011110001110001'
    )
    opcode = Halfword.fromUnsignedInteger(0b1010101010101010)
    value = Halfword.fromUnsignedInteger(0b1111111111111111)
    expect(setBits(opcode, 'X111XX11X1X1XXXX', value).toBinaryString()).toBe(
      '1010111010101111'
    )
    expect(setBits(opcode, 'X0X0X0X0X0X0X0X0', value).toBinaryString()).toBe(
      '1010101010101010'
    )
    expect(setBits(opcode, '0X0X0X0X0X0X0X0X', value).toBinaryString()).toBe(
      '1111111111111111'
    )
  })

  it('should throw when pattern not 16 characters', function () {
    expect(() => setBits(opcode, '1111111111XXXXXXX', value)).toThrow(
      VirtualBoardError
    )
    expect(() => setBits(opcode, '11111111XXXXXXX', value)).toThrow(
      VirtualBoardError
    )
  })

  it('should throw when pattern contains invalid characters', function () {
    expect(() => setBits(opcode, '1112111111XXXXXX', value)).toThrow(
      VirtualBoardError
    )
  })
})
