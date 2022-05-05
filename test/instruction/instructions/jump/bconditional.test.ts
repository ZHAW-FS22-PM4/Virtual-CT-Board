import { Memory } from 'board/memory'
import { Flag, Register, Registers } from 'board/registers'
import {
  BALConditionalJumpInstruction,
  BCCConditionalJumpInstruction,
  BCSConditionalJumpInstruction,
  BEQConditionalJumpInstruction,
  BGEConditionalJumpInstruction,
  BGTConditionalJumpInstruction,
  BHIConditionalJumpInstruction,
  BHSConditionalJumpInstruction,
  BLEConditionalJumpInstruction,
  BLOConditionalJumpInstruction,
  BLSConditionalJumpInstruction,
  BLTConditionalJumpInstruction,
  BMIConditionalJumpInstruction,
  BNEConditionalJumpInstruction,
  BPLConditionalJumpInstruction,
  BVCConditionalJumpInstruction,
  BVSConditionalJumpInstruction
} from 'instruction/instructions/jump/bconditional'
import { IInstruction, ILabelOffsets } from 'instruction/interfaces'
import { Halfword, Word } from 'types/binary'

const BEQ = new BEQConditionalJumpInstruction()
const BNE = new BNEConditionalJumpInstruction()
const BCS = new BCSConditionalJumpInstruction()
const BHS = new BHSConditionalJumpInstruction()
const BCC = new BCCConditionalJumpInstruction()
const BLO = new BLOConditionalJumpInstruction()
const BMI = new BMIConditionalJumpInstruction()
const BPL = new BPLConditionalJumpInstruction()
const BVS = new BVSConditionalJumpInstruction()
const BVC = new BVCConditionalJumpInstruction()
const BHI = new BHIConditionalJumpInstruction()
const BLS = new BLSConditionalJumpInstruction()
const BGE = new BGEConditionalJumpInstruction()
const BLT = new BLTConditionalJumpInstruction()
const BGT = new BGTConditionalJumpInstruction()
const BLE = new BLEConditionalJumpInstruction()
const BAL = new BALConditionalJumpInstruction()

let opcode
const registers = new Registers()
const memory = new Memory()

const offsetPlusTen: ILabelOffsets = {
  ['label']: Word.fromUnsignedInteger(10)
}

const offsetMinusTen: ILabelOffsets = {
  ['label']: Word.fromSignedInteger(-10)
}

const negativeOffsetTooBig: ILabelOffsets = {
  ['label']: Word.fromSignedInteger(-500)
}

const positiveOffsetTooBig: ILabelOffsets = {
  ['label']: Word.fromSignedInteger(500)
}

const negativeOffsetNotDividableByTwo: ILabelOffsets = {
  ['label']: Word.fromSignedInteger(-5)
}

const positiveOffsetNotDividableByTwo: ILabelOffsets = {
  ['label']: Word.fromSignedInteger(5)
}

describe('test canEncodeInstruction function for B conditional jump instruction', () => {
  it('should return true for correct name', () => {
    expect(BEQ.canEncodeInstruction('BEQ', ['label'])).toBe(true)
    expect(BNE.canEncodeInstruction('BNE', ['label'])).toBe(true)
    expect(BCS.canEncodeInstruction('BCS', ['label'])).toBe(true)
    expect(BHS.canEncodeInstruction('BHS', ['label'])).toBe(true)
    expect(BCC.canEncodeInstruction('BCC', ['label'])).toBe(true)
    expect(BLO.canEncodeInstruction('BLO', ['label'])).toBe(true)
    expect(BMI.canEncodeInstruction('BMI', ['label'])).toBe(true)
    expect(BPL.canEncodeInstruction('BPL', ['label'])).toBe(true)
    expect(BVS.canEncodeInstruction('BVS', ['label'])).toBe(true)
    expect(BVC.canEncodeInstruction('BVC', ['label'])).toBe(true)
    expect(BHI.canEncodeInstruction('BHI', ['label'])).toBe(true)
    expect(BLS.canEncodeInstruction('BLS', ['label'])).toBe(true)
    expect(BGE.canEncodeInstruction('BGE', ['label'])).toBe(true)
    expect(BLT.canEncodeInstruction('BLT', ['label'])).toBe(true)
    expect(BGT.canEncodeInstruction('BGT', ['label'])).toBe(true)
    expect(BLE.canEncodeInstruction('BLE', ['label'])).toBe(true)
    expect(BAL.canEncodeInstruction('BAL', ['label'])).toBe(true)
  })

  it('should return false for wrong name of instruction', () => {
    expect(BEQ.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BNE.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BCS.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BHS.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BCC.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BLO.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BMI.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BPL.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BVS.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BVC.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BHI.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BLS.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BGE.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BLT.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BGT.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BLE.canEncodeInstruction('WRONG', ['label'])).toBe(false)
    expect(BAL.canEncodeInstruction('WRONG', ['label'])).toBe(false)
  })
})

describe('test encodeInstruction function for B conditional jump instruction', () => {
  it('should throw exception in case of invalid amount of arguments', () => {
    // here only BEQ is used as the other instructions are implemented exactly the same
    expect(() => BEQ.encodeInstruction([])).toThrow()
    expect(() => BEQ.encodeInstruction(['label', 'label'])).toThrow()
  })
  test('test encodeInstruction without passing any label offset information', () => {
    expect(BEQ.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101000000000000)
    )
    expect(BNE.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101000100000000)
    )
    expect(BCS.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001000000000)
    )
    expect(BHS.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001000000000)
    )
    expect(BCC.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001100000000)
    )
    expect(BLO.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001100000000)
    )
    expect(BMI.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101010000000000)
    )
    expect(BPL.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101010100000000)
    )
    expect(BVS.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101011000000000)
    )
    expect(BVC.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101011100000000)
    )
    expect(BHI.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101100000000000)
    )
    expect(BLS.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101100100000000)
    )
    expect(BGE.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101101000000000)
    )
    expect(BLT.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101101100000000)
    )
    expect(BGT.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101110000000000)
    )
    expect(BLE.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101110100000000)
    )
    expect(BAL.encodeInstruction(['label'])[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101111000000000)
    )
  })
  test('test encodeInstruction with passing label offset information', () => {
    expect(BEQ.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101000000000101)
    )
    expect(BNE.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101000100000101)
    )
    expect(BCS.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001000000101)
    )
    expect(BHS.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001000000101)
    )
    expect(BCC.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001100000101)
    )
    expect(BLO.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001100000101)
    )
    expect(BMI.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101010000000101)
    )
    expect(BPL.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101010100000101)
    )
    expect(BVS.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101011000000101)
    )
    expect(BVC.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101011100000101)
    )
    expect(BHI.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101100000000101)
    )
    expect(BLS.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101100100000101)
    )
    expect(BGE.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101101000000101)
    )
    expect(BLT.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101101100000101)
    )
    expect(BGT.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101110000000101)
    )
    expect(BLE.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101110100000101)
    )
    expect(BAL.encodeInstruction(['label'], offsetPlusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101111000000101)
    )

    expect(BEQ.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101000011111011)
    )
    expect(BNE.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101000111111011)
    )
    expect(BCS.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001011111011)
    )
    expect(BHS.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001011111011)
    )
    expect(BCC.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001111111011)
    )
    expect(BLO.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101001111111011)
    )
    expect(BMI.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101010011111011)
    )
    expect(BPL.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101010111111011)
    )
    expect(BVS.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101011011111011)
    )
    expect(BVC.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101011111111011)
    )
    expect(BHI.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101100011111011)
    )
    expect(BLS.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101100111111011)
    )
    expect(BGE.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101101011111011)
    )
    expect(BLT.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101101111111011)
    )
    expect(BGT.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101110011111011)
    )
    expect(BLE.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101110111111011)
    )
    expect(BAL.encodeInstruction(['label'], offsetMinusTen)[0]).toEqual(
      Halfword.fromUnsignedInteger(0b1101111011111011)
    )
  })
  test('test encodeInstruction with passing label offset information that is too large', () => {
    // here only BEQ is used as the other instructions are implemented exactly the same
    expect(() =>
      BEQ.encodeInstruction(['label'], negativeOffsetTooBig)
    ).toThrow()
    expect(() =>
      BEQ.encodeInstruction(['label'], positiveOffsetTooBig)
    ).toThrow()
  })
  test('test encodeInstruction with passing label offset information that is not dividable by two', () => {
    // here only BEQ is used as the other instructions are implemented exactly the same
    expect(() =>
      BEQ.encodeInstruction(['label'], negativeOffsetNotDividableByTwo)
    ).toThrow()
    expect(() =>
      BEQ.encodeInstruction(['label'], positiveOffsetNotDividableByTwo)
    ).toThrow()
  })
})

describe('test onExecuteInstruction function for B conditional jump instruction', () => {
  const firstPCValue = 30
  const secondPCValue = 20

  test('test execution if flags are correctly set for BEQ', () => {
    reset()
    registers.setFlag(Flag.Z, true)
    execute(BEQ, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BNE', () => {
    reset()
    registers.setFlag(Flag.Z, false)
    execute(BNE, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BCS', () => {
    reset()
    registers.setFlag(Flag.C, true)
    execute(BCS, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BHS', () => {
    reset()
    registers.setFlag(Flag.C, true)
    execute(BHS, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BCC', () => {
    reset()
    registers.setFlag(Flag.C, false)
    execute(BCC, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BLO', () => {
    reset()
    registers.setFlag(Flag.C, false)
    execute(BLO, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BMI', () => {
    reset()
    registers.setFlag(Flag.N, true)
    execute(BMI, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BPL', () => {
    reset()
    registers.setFlag(Flag.N, false)
    execute(BPL, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BVS', () => {
    reset()
    registers.setFlag(Flag.V, true)
    execute(BVS, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BVC', () => {
    reset()
    registers.setFlag(Flag.V, false)
    execute(BVC, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BHI', () => {
    reset()
    registers.setFlag(Flag.C, true)
    registers.setFlag(Flag.Z, false)
    execute(BHI, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BLS', () => {
    reset()
    registers.setFlag(Flag.C, false)
    execute(BLS, firstPCValue, secondPCValue)
    reset()
    registers.setFlag(Flag.Z, true)
    execute(BLS, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BGE', () => {
    reset()
    registers.setFlag(Flag.N, true)
    registers.setFlag(Flag.V, true)
    execute(BGE, firstPCValue, secondPCValue)
    reset()
    registers.setFlag(Flag.N, false)
    registers.setFlag(Flag.V, false)
    execute(BGE, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BLT', () => {
    reset()
    registers.setFlag(Flag.N, true)
    registers.setFlag(Flag.V, false)
    execute(BLT, firstPCValue, secondPCValue)
    reset()
    registers.setFlag(Flag.N, false)
    registers.setFlag(Flag.V, true)
    execute(BLT, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BGT', () => {
    reset()
    registers.setFlag(Flag.Z, false)
    registers.setFlag(Flag.N, true)
    registers.setFlag(Flag.V, true)
    execute(BGT, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BLE', () => {
    reset()
    registers.setFlag(Flag.Z, true)
    execute(BLE, firstPCValue, secondPCValue)
    reset()
    registers.setFlag(Flag.N, true)
    registers.setFlag(Flag.V, false)
    execute(BLE, firstPCValue, secondPCValue)
  })

  test('test execution if flags are correctly set for BAL', () => {
    reset()
    registers.setFlag(Flag.Z, true)
    execute(BAL, firstPCValue, secondPCValue)
    reset()
    registers.setFlag(Flag.N, true)
    registers.setFlag(Flag.V, false)
    execute(BAL, firstPCValue, secondPCValue)
  })
})

function reset() {
  registers.reset()
  registers.writeRegister(Register.PC, Word.fromUnsignedInteger(20))
}

function execute(
  instruction: IInstruction,
  firstPCValue: number,
  secondPCValue: number
) {
  opcode = instruction.encodeInstruction(['label'], offsetPlusTen)
  instruction.executeInstruction(opcode, registers, memory)
  expect(registers.readRegister(Register.PC)).toEqual(
    Word.fromUnsignedInteger(firstPCValue)
  )
  opcode = instruction.encodeInstruction(['label'], offsetMinusTen)
  instruction.executeInstruction(opcode, registers, memory)
  expect(registers.readRegister(Register.PC)).toEqual(
    Word.fromUnsignedInteger(secondPCValue)
  )
}
