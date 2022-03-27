import { Halfword } from 'types/binary'
import {
  MovInstruction,
  MovsFromLiteralInstruction,
  MovsFromRegisterInstruction
} from 'instruction/instructions/mov'

const invalidInstructionName = 'NeverGonnaBeAnInstruction'
const invalidInstructionOptions = ['R77', '#2#']

const movName = 'MOV'
const movsName = 'MOVS'
const movOptions = ['R8', 'R9']
const movsOptions = ['R2', 'R7']
const movsLiteralOptions = ['R0', '#0xe6']
const movsLiteralOptcode = Halfword.fromUnsignedInteger(0x20e6)

let instructionMov = new MovInstruction()
let instructionMovsLiteral = new MovsFromLiteralInstruction()
let instructionMovsRegisters = new MovsFromRegisterInstruction()
describe('test canEncodeInstruction (wheter the class is responsible for this command) function', () => {
  test('MOV encoder', () => {
    expect(
      instructionMov.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(instructionMov.canEncodeInstruction(movsName, movsOptions)).toBe(
      false
    )
    expect(instructionMov.canEncodeInstruction(movName, movOptions)).toBe(true)
  })
  test('MOVS literal encoder', () => {
    expect(
      instructionMovsLiteral.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionMovsLiteral.canEncodeInstruction(movsName, movsOptions)
    ).toBe(false)
    expect(
      instructionMovsLiteral.canEncodeInstruction(movsName, movsLiteralOptions)
    ).toBe(true)
  })
  test('MOVS register encoder', () => {
    expect(
      instructionMovsRegisters.canEncodeInstruction(
        invalidInstructionName,
        invalidInstructionOptions
      )
    ).toBe(false)
    expect(
      instructionMovsRegisters.canEncodeInstruction(
        movsName,
        movsLiteralOptions
      )
    ).toBe(false)
    expect(
      instructionMovsRegisters.canEncodeInstruction(movsName, movsOptions)
    ).toBe(true)
  })
})
describe('test encodeInstruction (command with options --> optcode) function', () => {
  test('MOV handler', () => {})
  test('MOVS handler', () => {})
})
describe('test executeInstruction function', () => {
  test('MOV handler', () => {})
  test('MOVS handler', () => {})
})
