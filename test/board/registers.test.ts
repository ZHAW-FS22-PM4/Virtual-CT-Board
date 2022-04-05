/**
 * Tests the register representation of the board's cpu
 */

import { Word } from 'types/binary'
import { Register, Registers, Flag, IFlag } from 'board/registers'

let flags: IFlag
let registers: Registers = new Registers()

beforeEach(() => {
  registers = new Registers()
  registers.writeRegister(Register.R0, Word.fromUnsignedInteger(13495))
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0xb53f))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x08))
  registers.writeRegister(Register.R10, Word.fromUnsignedInteger(20))
  registers.writeRegister(Register.LR, Word.fromUnsignedInteger(2345))
  registers.writeRegister(Register.SP, Word.fromUnsignedInteger(0x78a48c2b))
  registers.writeRegister(Register.APSR, Word.fromUnsignedInteger(0xa0000000))
})

describe('test readRegister() function', () => {
  test('test that readRegister() returns the correct value', () => {
    expect(registers.readRegister(Register.R0).toUnsignedInteger()).toBe(13495)
    expect(registers.readRegister(1).toUnsignedInteger()).toBe(0xb53f)
    expect(registers.readRegister(13).toUnsignedInteger()).toBe(0x78a48c2b)
  })
})

describe('test writeRegister() function', () => {
  test('test that values are written to the registers', () => {
    registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0xff05))
    registers.writeRegister(3, Word.fromUnsignedInteger(123456))
    registers.writeRegister(14, Word.fromUnsignedInteger(0x78a48f2b))

    expect(registers.readRegister(Register.R2).toUnsignedInteger()).toBe(0xff05)
    expect(registers.readRegister(Register.R3).toUnsignedInteger()).toBe(123456)
    expect(registers.readRegister(Register.LR).toUnsignedInteger()).toBe(
      0x78a48f2b
    )
  })
})

describe('test clear() function', () => {
  test('test that all flags are cleared', () => {
    registers.clear()
    expect(registers.readRegister(Register.R2).toUnsignedInteger()).toBe(0)
    expect(registers.readRegister(10).toUnsignedInteger()).toBe(0)
    expect(registers.readRegister(Register.LR).toUnsignedInteger()).toBe(0)
    expect(registers.isFlagSet(Flag.N)).toBe(false)
    expect(registers.isFlagSet(Flag.C)).toBe(false)
  })
})

describe('test flag functions', () => {
  test('test isFlagSet() function', () => {
    expect(registers.isFlagSet(Flag.N)).toBe(true)
    expect(registers.isFlagSet(Flag.Z)).toBe(false)
    expect(registers.isFlagSet(Flag.C)).toBe(true)
    expect(registers.isFlagSet(Flag.V)).toBe(false)
  })
  test('test that setFlag() sets flag or clears it', () => {
    registers.setFlag(Flag.C, true)
    registers.setFlag(Flag.Z, true)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0xe0000000)
    )
    registers.setFlag(Flag.V, false)
    registers.setFlag(Flag.N, false)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x60000000)
    )
  })
  test('test that setFlags() function is not overriding other flags', () => {
    registers.setFlag(Flag.N, false)
    registers.setFlag(Flag.Z, false)
    registers.setFlag(Flag.C, false)
    registers.setFlag(Flag.V, false)

    flags = {
      [Flag.N]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x80000000)
    )

    flags = {
      [Flag.Z]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0xc0000000)
    )

    flags = {
      [Flag.C]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0xe0000000)
    )

    flags = {
      [Flag.V]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0xf0000000)
    )
  })
  test('test setFlags() function', () => {
    flags = {
      [Flag.N]: false,
      [Flag.Z]: false,
      [Flag.C]: false,
      [Flag.V]: false
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0)
    )

    flags = {
      [Flag.N]: false,
      [Flag.Z]: false,
      [Flag.C]: false,
      [Flag.V]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x10000000)
    )

    flags = {
      [Flag.N]: false,
      [Flag.Z]: false,
      [Flag.C]: true,
      [Flag.V]: false
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x20000000)
    )

    flags = {
      [Flag.N]: false,
      [Flag.Z]: false,
      [Flag.C]: true,
      [Flag.V]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x30000000)
    )

    flags = {
      [Flag.N]: false,
      [Flag.Z]: true,
      [Flag.C]: false,
      [Flag.V]: false
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x40000000)
    )

    flags = {
      [Flag.N]: false,
      [Flag.Z]: true,
      [Flag.C]: false,
      [Flag.V]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x50000000)
    )

    flags = {
      [Flag.N]: false,
      [Flag.Z]: true,
      [Flag.C]: true,
      [Flag.V]: false
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x60000000)
    )

    flags = {
      [Flag.N]: false,
      [Flag.Z]: true,
      [Flag.C]: true,
      [Flag.V]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x70000000)
    )

    flags = {
      [Flag.N]: true,
      [Flag.Z]: false,
      [Flag.C]: false,
      [Flag.V]: false
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x80000000)
    )

    flags = {
      [Flag.N]: true,
      [Flag.Z]: false,
      [Flag.C]: false,
      [Flag.V]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x90000000)
    )

    flags = {
      [Flag.N]: true,
      [Flag.Z]: false,
      [Flag.C]: true,
      [Flag.V]: false
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0xa0000000)
    )

    flags = {
      [Flag.N]: true,
      [Flag.Z]: false,
      [Flag.C]: true,
      [Flag.V]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0xb0000000)
    )

    flags = {
      [Flag.N]: true,
      [Flag.Z]: true,
      [Flag.C]: false,
      [Flag.V]: false
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0xc0000000)
    )

    flags = {
      [Flag.N]: true,
      [Flag.Z]: true,
      [Flag.C]: false,
      [Flag.V]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0xd0000000)
    )

    flags = {
      [Flag.N]: true,
      [Flag.Z]: true,
      [Flag.C]: true,
      [Flag.V]: false
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0xe0000000)
    )

    flags = {
      [Flag.N]: true,
      [Flag.Z]: true,
      [Flag.C]: true,
      [Flag.V]: true
    }
    registers.setFlags(flags)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0xf0000000)
    )
  })
  test('test setFlag() function for Flag.N', () => {
    registers.setFlag(Flag.N, false)
    expect(registers.isFlagSet(Flag.N)).toBe(false)
    registers.setFlag(Flag.N, true)
    expect(registers.isFlagSet(Flag.N)).toBe(true)
    // unchanged remaining flags
    expect(registers.isFlagSet(Flag.Z)).toBe(false)
    expect(registers.isFlagSet(Flag.C)).toBe(true)
    expect(registers.isFlagSet(Flag.V)).toBe(false)
  })
  test('test setFlag() function for Flag.Z', () => {
    registers.setFlag(Flag.Z, true)
    expect(registers.isFlagSet(Flag.Z)).toBe(true)
    registers.setFlag(Flag.Z, false)
    expect(registers.isFlagSet(Flag.Z)).toBe(false)
    // unchanged remaining flags
    expect(registers.isFlagSet(Flag.N)).toBe(true)
    expect(registers.isFlagSet(Flag.C)).toBe(true)
    expect(registers.isFlagSet(Flag.V)).toBe(false)
  })
  test('test setFlag() function for Flag.C', () => {
    registers.setFlag(Flag.C, false)
    expect(registers.isFlagSet(Flag.C)).toBe(false)
    registers.setFlag(Flag.C, true)
    expect(registers.isFlagSet(Flag.C)).toBe(true)
    // unchanged remaining flags
    expect(registers.isFlagSet(Flag.N)).toBe(true)
    expect(registers.isFlagSet(Flag.Z)).toBe(false)
    expect(registers.isFlagSet(Flag.V)).toBe(false)
  })
  test('test setFlag() function for Flag.V', () => {
    registers.setFlag(Flag.V, true)
    expect(registers.isFlagSet(Flag.V)).toBe(true)
    registers.setFlag(Flag.V, false)
    expect(registers.isFlagSet(Flag.V)).toBe(false)
    // unchanged remaining flags
    expect(registers.isFlagSet(Flag.N)).toBe(true)
    expect(registers.isFlagSet(Flag.Z)).toBe(false)
    expect(registers.isFlagSet(Flag.C)).toBe(true)
  })
  test('test that isLowRegister() register returns true for low registers', () => {
    expect(Registers.isLowRegister(Register.R0)).toBe(true)
    expect(Registers.isLowRegister(Register.R3)).toBe(true)
    expect(Registers.isLowRegister(Register.R7)).toBe(true)
    expect(Registers.isLowRegister(Register.R8)).toBe(false)
    expect(Registers.isLowRegister(Register.R12)).toBe(false)
    expect(Registers.isLowRegister(Register.APSR)).toBe(false)
  })
})
