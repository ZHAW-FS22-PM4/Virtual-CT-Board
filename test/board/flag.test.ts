/**
 * Tests the flag representation of the board's cpu
 */

import { Byte } from 'types/binary'
import { Flag, Flags } from 'board/flags'

let flags: Flags = new Flags()

beforeEach(() => {
  flags = new Flags()
  flags.writeFlag(Flag.N, Byte.ZERO_BYTE)
  flags.writeFlag(Flag.Z, Byte.ZERO_BYTE)
  flags.writeFlag(Flag.C, Byte.fromUnsignedInteger(1))
  flags.writeFlag(Flag.V, Byte.fromUnsignedInteger(1))
})

describe('test readFlag function', () => {
  test('should read the values in the flags', () => {
    expect(flags.readFlag(Flag.Z).toUnsignedInteger()).toBe(0)
    expect(flags.readFlag(Flag.C).toUnsignedInteger()).toBe(1)
    expect(flags.readFlag(Flag.V).toUnsignedInteger()).toBe(1)
  })
})

describe('test writeFlag function', () => {
  test('should wirte values in the flags', () => {
    flags.writeFlag(Flag.Z, Byte.fromUnsignedInteger(1))
    flags.writeFlag(Flag.V, Byte.ZERO_BYTE)
    flags.writeFlag(Flag.N, Byte.ZERO_BYTE)

    expect(flags.readFlag(Flag.Z).toUnsignedInteger()).toBe(1)
    expect(flags.readFlag(Flag.V).toUnsignedInteger()).toBe(0)
    expect(flags.readFlag(Flag.N).toUnsignedInteger()).toBe(0)
  })
})

describe('test clear function', () => {
  test('should clear all values in the flags', () => {
    flags.clear()
    expect(flags.readFlag(Flag.N).toUnsignedInteger()).toBe(0)
    expect(flags.readFlag(Flag.Z).toUnsignedInteger()).toBe(0)
    expect(flags.readFlag(Flag.C).toUnsignedInteger()).toBe(0)
    expect(flags.readFlag(Flag.V).toUnsignedInteger()).toBe(0)
  })
})
