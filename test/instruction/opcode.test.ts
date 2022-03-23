import { match } from 'instruction/opcode'
import { Halfword } from 'types/binary'

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
