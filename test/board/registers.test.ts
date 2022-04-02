/**
 * Tests the register representation of the board's cpu
 */

import { Word } from 'types/binary'
import { Register, Registers, Flag } from 'board/registers'

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

describe('test readRegister function', () => {
  test('should read the values in the registers', () => {
    expect(registers.readRegister(Register.R0).toUnsignedInteger()).toBe(13495)
    expect(registers.readRegister(1).toUnsignedInteger()).toBe(0xb53f)
    expect(registers.readRegister(13).toUnsignedInteger()).toBe(0x78a48c2b)
  })
})

describe('test writeRegister function', () => {
  test('should wirte values in the registers', () => {
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

describe('test reset function', () => {
  test('should reset all values in the registers', () => {
    registers.reset()
    expect(registers.readRegister(Register.R2).toUnsignedInteger()).toBe(0)
    expect(registers.readRegister(10).toUnsignedInteger()).toBe(0)
    expect(registers.readRegister(Register.LR).toUnsignedInteger()).toBe(0)
    expect(registers.isFlagSet(Flag.N)).toBe(false)
    expect(registers.isFlagSet(Flag.C)).toBe(false)
  })
})
describe('test flag functions', () => {
  test('isFlagSet returns correct value', () => {
    expect(registers.isFlagSet(Flag.N)).toBe(true)
    expect(registers.isFlagSet(Flag.Z)).toBe(false)
    expect(registers.isFlagSet(Flag.C)).toBe(true)
    expect(registers.isFlagSet(Flag.V)).toBe(false)
  })
  test('setFlag sets flag or clears it', () => {
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
  test('setFlags sets correct flags', () => {
    registers.setFlags(Word.fromUnsignedInteger(0))
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x40000000)
    )

    registers.setFlags(Word.fromUnsignedInteger(0x80000000))
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x80000000)
    )
    registers.setFlags(Word.fromUnsignedInteger(0xf000e000), true)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0xb0000000)
    )
    registers.setFlags(Word.fromUnsignedInteger(0), true, true)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x60000000)
    )
    registers.setFlags(Word.fromUnsignedInteger(0), false, true)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x50000000)
    )
    registers.setFlags(Word.fromUnsignedInteger(0x12345678))
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x00000000)
    )
    registers.setFlags(Word.fromUnsignedInteger(0x44332211), true)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x30000000)
    )
    registers.setFlags(Word.fromUnsignedInteger(0x44332211), true, true)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x20000000)
    )
    registers.setFlags(Word.fromUnsignedInteger(0x44332211), false, true)
    expect(registers.readRegister(Register.APSR)).toEqual(
      Word.fromUnsignedInteger(0x10000000)
    )
  })

  test('setFlag individually: setNegativeFlag', () => {
    registers.setNegativeFlag(Word.fromUnsignedInteger(0x70012004))
    expect(registers.isFlagSet(Flag.N)).toBe(false)
    registers.setNegativeFlag(Word.fromUnsignedInteger(0xc1234567))
    expect(registers.isFlagSet(Flag.N)).toBe(true)
    registers.setNegativeFlag(Word.fromUnsignedInteger(0x00112233))
    expect(registers.isFlagSet(Flag.N)).toBe(false)
    //unchanged remaining flags
    expect(registers.isFlagSet(Flag.Z)).toBe(false)
    expect(registers.isFlagSet(Flag.C)).toBe(true)
    expect(registers.isFlagSet(Flag.V)).toBe(false)
  })
  test('setFlag individually: setZeroFlag', () => {
    registers.setZeroFlag(0x00000)
    expect(registers.isFlagSet(Flag.Z)).toBe(true)
    registers.setZeroFlag(0x00001)
    expect(registers.isFlagSet(Flag.Z)).toBe(false)
    registers.setZeroFlag(0x800000000)
    expect(registers.isFlagSet(Flag.Z)).toBe(false)
    //unchanged remaining flags
    expect(registers.isFlagSet(Flag.N)).toBe(true)
    expect(registers.isFlagSet(Flag.C)).toBe(true)
    expect(registers.isFlagSet(Flag.V)).toBe(false)
  })
  test('setFlag individually: setCarryFlag', () => {
    registers.setCarryFlag(false)
    expect(registers.isFlagSet(Flag.C)).toBe(false)
    registers.setCarryFlag(true)
    expect(registers.isFlagSet(Flag.C)).toBe(true)
    //unchanged remaining flags
    expect(registers.isFlagSet(Flag.N)).toBe(true)
    expect(registers.isFlagSet(Flag.Z)).toBe(false)
    expect(registers.isFlagSet(Flag.V)).toBe(false)
  })
  test('setFlag individually: setOverflowFlag', () => {
    registers.setOverflowFlag(false, true)
    expect(registers.isFlagSet(Flag.V)).toBe(true)
    registers.setOverflowFlag(false, false)
    expect(registers.isFlagSet(Flag.V)).toBe(false)
    registers.setOverflowFlag(true, false)
    expect(registers.isFlagSet(Flag.V)).toBe(true)
    registers.setOverflowFlag(true, true)
    expect(registers.isFlagSet(Flag.V)).toBe(false)
    //unchanged remaining flags
    expect(registers.isFlagSet(Flag.N)).toBe(true)
    expect(registers.isFlagSet(Flag.Z)).toBe(false)
    expect(registers.isFlagSet(Flag.C)).toBe(true)
  })
  test('isLowRegister returns only for low registers true', () => {
    expect(Registers.isLowRegister(Register.R0)).toBe(true)
    expect(Registers.isLowRegister(Register.R3)).toBe(true)
    expect(Registers.isLowRegister(Register.R7)).toBe(true)
    expect(Registers.isLowRegister(Register.R8)).toBe(false)
    expect(Registers.isLowRegister(Register.R12)).toBe(false)
    expect(Registers.isLowRegister(Register.APSR)).toBe(false)
  })
})
