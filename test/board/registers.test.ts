/**
 * Tests the register representation of the board's cpu
 */

import { Word } from 'types/binary'
import { Register, Registers } from 'board/registers'

let registers: Registers = new Registers()

beforeEach(() => {
  registers = new Registers()
  registers.writeRegister(Register.R0, Word.fromUnsignedInteger(13495))
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0xb53f))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x08))
  registers.writeRegister(Register.R10, Word.fromUnsignedInteger(20))
  registers.writeRegister(Register.LR, Word.fromUnsignedInteger(2345))
  registers.writeRegister(Register.SP, Word.fromUnsignedInteger(0x78a48c2b))
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

describe('test clear function', () => {
  test('should clear all values in the registers', () => {
    registers.clear()
    expect(registers.readRegister(Register.R2).toUnsignedInteger()).toBe(0)
    expect(registers.readRegister(10).toUnsignedInteger()).toBe(0)
    expect(registers.readRegister(Register.LR).toUnsignedInteger()).toBe(0)
  })
})
