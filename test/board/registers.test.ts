/**
 * Tests the register representation of the board's cpu
 */

import { Register, Registers } from '../../src/board/registers'
import { Word } from '../../src/types/binary'

let registers: Registers = new Registers()

beforeEach(() => {
  registers = new Registers()
  registers.writeRegister(Register.R0, Word.fromUnsignedInteger(13495))
  registers.writeRegister(Register.R1, Word.fromUnsignedInteger(0xB53F))
  registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0x08))
  registers.writeRegister(Register.R10, Word.fromUnsignedInteger(20))
  registers.writeRegister(Register.LR, Word.fromUnsignedInteger(2345))
  registers.writeRegister(Register.SP, Word.fromUnsignedInteger(0x78A48C2B))
})

describe('test readRegister function', () => {
  test('should read the values in the registers', () => {
    expect(registers.readRegister(Register.R0).toUnsignedInteger()).toBe(13495)
    expect(registers.readRegister(1).toUnsignedInteger()).toBe(0xB53F)
    expect(registers.readRegister(13).toUnsignedInteger()).toBe(0x78A48C2B)
  })
})

describe('test writeRegister function', () => {
  test('should wirte values in the registers', () => {
    registers.writeRegister(Register.R2, Word.fromUnsignedInteger(0xFF05))
    registers.writeRegister(3, Word.fromUnsignedInteger(123456))
    registers.writeRegister(14, Word.fromUnsignedInteger(0x78A48F2B))

    expect(registers.readRegister(Register.R2).toUnsignedInteger()).toBe(0xFF05)
    expect(registers.readRegister(Register.R3).toUnsignedInteger()).toBe(123456)
    expect(registers.readRegister(Register.LR).toUnsignedInteger()).toBe(0x78A48F2B)
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
