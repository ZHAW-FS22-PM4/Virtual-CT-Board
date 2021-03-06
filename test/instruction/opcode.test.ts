import { InstructionError } from 'instruction/error'
import {
  checkOptionCount,
  create,
  createImmediateBits,
  createLowRegisterBits,
  createRegisterBits,
  getBits,
  isImmediate,
  isLowRegister,
  isOptionCountValid,
  match,
  setBits
} from 'instruction/opcode'
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

describe('test create function', function () {
  it('should create a correct opcode from a pattern', function () {
    expect(create('1111111111XXXXXX').toBinaryString()).toBe('1111111111000000')
    expect(create('01010101XXXXXXXX').toBinaryString()).toBe('0101010100000000')
  })

  it('should throw when pattern not 16 characters', function () {
    expect(() => create('1111111111XXXXXXX')).toThrow(Error)
    expect(() => create('11111111XXXXXXX')).toThrow(Error)
  })

  it('should throw when pattern contains invalid characters', function () {
    expect(() => create('1112111111XXXXXX')).toThrow(Error)
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
  it('opcode should remain unchanged if pattern has no placeholder (X) defined', function () {
    expect(setBits(opcode, '1111111111111111', value)).toBe(opcode)
    expect(setBits(opcode, '0000000000000000', value)).toBe(opcode)
  })

  it('should throw when pattern not 16 characters', function () {
    expect(() => setBits(opcode, '1111111111XXXXXXX', value)).toThrow(Error)
    expect(() => setBits(opcode, '11111111XXXXXXX', value)).toThrow(Error)
  })

  it('should throw when pattern contains invalid characters', function () {
    expect(() => setBits(opcode, '1112111111XXXXXX', value)).toThrow(Error)
  })
})

describe('test getBits function', function () {
  let opcode: Halfword = Halfword.fromUnsignedInteger(0b0011010001110001)
  it('should get correct bits according to a pattern', function () {
    expect(getBits(opcode, '1111111111XXXXXX').toBinaryString()).toBe(
      '0000000000110001'
    )
    expect(getBits(opcode, '01010101010101XX').toBinaryString()).toBe(
      '0000000000000001'
    )
    expect(getBits(opcode, 'XX010X010101010X').toBinaryString()).toBe(
      '0000000000000011'
    )
    opcode = Halfword.fromUnsignedInteger(0b1010101010101010)
    expect(getBits(opcode, 'X111XX11X1X1XXXX').toBinaryString()).toBe(
      '0000000110111010'
    )
    expect(getBits(opcode, 'X0X0X0X0X0X0X0X0').toBinaryString()).toBe(
      '0000000011111111'
    )
    expect(getBits(opcode, '0X0X0X0X0X0X0X0X').toBinaryString()).toBe(
      '0000000000000000'
    )
  })
  it('should get constant 0 if pattern has no placeholder (X) defined', function () {
    expect(getBits(opcode, '1111111111111111').value).toBe(0)
    expect(getBits(opcode, '0000000000000000').value).toBe(0)
  })

  it('should throw when pattern not 16 characters', function () {
    expect(() => getBits(opcode, '1111111111XXXXXXX')).toThrow(Error)
    expect(() => getBits(opcode, '11111111XXXXXXX')).toThrow(Error)
  })

  it('should throw when pattern contains invalid characters', function () {
    expect(() => getBits(opcode, '1112111111XXXXXX')).toThrow(Error)
  })
})

describe('test createLowRegisterBits function', function () {
  it('should create correct opcode for low registers', function () {
    expect(createLowRegisterBits('R5').value).toBe(5)
    expect(createLowRegisterBits('R0').value).toBe(0)
    expect(createLowRegisterBits('R7').value).toBe(7)
  })

  it('should throw when high register is provided', function () {
    let notLowRegisterError = new InstructionError(
      'Provided register is not a low register.'
    )
    expect(() => createLowRegisterBits('R8')).toThrow(notLowRegisterError)
    expect(() => createLowRegisterBits('SP')).toThrow(notLowRegisterError)
    expect(() => createLowRegisterBits('PC')).toThrow(notLowRegisterError)
  })

  it('should throw when invalid register is provided', function () {
    let notValidRegisterError = new InstructionError(
      `Option 'R13' is not a valid register.`
    )
    expect(() => createLowRegisterBits('R13')).toThrow(notValidRegisterError)
    notValidRegisterError.message = `Option 'ABC' is not a valid register.`
    expect(() => createLowRegisterBits('ABC')).toThrow(notValidRegisterError)
  })
})

describe('test createRegisterBits function', function () {
  it('should create correct opcode for low registers', function () {
    expect(createRegisterBits('R5').value).toBe(5)
    expect(createRegisterBits('R1').value).toBe(1)
    expect(createRegisterBits('R10').value).toBe(10)
    expect(createRegisterBits('LR').value).toBe(14)
    expect(createRegisterBits('PC').value).toBe(15)
  })

  it('should throw when invalid register is provided', function () {
    let notValidRegisterError = new InstructionError(
      `Option '12R' is not a valid register.`
    )
    expect(() => createRegisterBits('12R')).toThrow(notValidRegisterError)
    notValidRegisterError.message = `Option '123' is not a valid register.`
    expect(() => createRegisterBits('123')).toThrow(notValidRegisterError)
  })
})

describe('test createImmediateBits function', function () {
  it('should create correct opcode for low registers', function () {
    expect(createImmediateBits('#12', 5).value).toBe(12)
    expect(createImmediateBits('#0x12', 5).value).toBe(18)
    expect(createImmediateBits('#36', 8).value).toBe(36)
    expect(createImmediateBits('#0x248', 11).value).toBe(584)
    expect(createImmediateBits('#0xfdb9', 16).value).toBe(64953)
  })

  it('should throw when immediate bits are not enough for value', function () {
    let tooLessBitsForImmediateError = new InstructionError(
      'Immediate value uses too much bits (try with a smaller number).'
    )
    expect(() => createImmediateBits('#0x22', 5)).toThrow(
      tooLessBitsForImmediateError
    )
    expect(() => createImmediateBits('#4', 1)).toThrow(
      tooLessBitsForImmediateError
    )
    //out of range of halfword
    expect(() => createImmediateBits('#0x12345', 16)).toThrow(
      new Error(
        `OutOfRange: 16-bit unsigned integer must be an integer in range 0 to 65535 (provided: 74565).`
      )
    )
  })

  it('should throw when no immediate is provided', function () {
    let noImmediateError = new InstructionError(
      'Is not an immediate value (should start with #).'
    )
    expect(() => createImmediateBits('R9', 4)).toThrow(noImmediateError)
    expect(() => createImmediateBits('14', 7)).toThrow(noImmediateError)
  })
  it('should throw when immediate is not parsable number', function () {
    let noParsableNumberError = new InstructionError(
      'OutOfRange: 16-bit unsigned integer must be an integer in range 0 to 65535 (provided: NaN).'
    )
    expect(() => createImmediateBits('##', 9)).toThrow(noParsableNumberError)
    expect(() => createImmediateBits('#af', 9)).toThrow(noParsableNumberError)
    expect(() => createImmediateBits('#0xrd', 9)).toThrow(noParsableNumberError)
  })
})

describe('test checkOptionCount and isOptionCountValid function', function () {
  let oneOption: string[] = ['R6']
  let threeOptions: string[] = ['a', 'b', 'c']
  let fourOptions: string[] = ['1', '2', '3', '4']
  it('should true or not throw an exeption for exact valid option count', function () {
    expect(isOptionCountValid([], 0)).toBe(true)
    expect(isOptionCountValid(oneOption, 1)).toBe(true)
    expect(isOptionCountValid(threeOptions, 3)).toBe(true)
    expect(isOptionCountValid(fourOptions, 4)).toBe(true)

    expect(() => checkOptionCount([], 0)).not.toThrow(InstructionError)
    expect(() => checkOptionCount(oneOption, 1)).not.toThrow(InstructionError)
    expect(() => checkOptionCount(threeOptions, 3)).not.toThrow(
      InstructionError
    )
    expect(() => checkOptionCount(fourOptions, 4)).not.toThrow(InstructionError)
  })
  it('should true or not throw an exeption for option count within range', function () {
    expect(isOptionCountValid(oneOption, 0, 2)).toBe(true)
    expect(isOptionCountValid(threeOptions, 3, 8)).toBe(true)
    expect(isOptionCountValid(fourOptions, 2, 4)).toBe(true)

    expect(() => checkOptionCount(oneOption, 1, 2)).not.toThrow(
      InstructionError
    )
    expect(() => checkOptionCount(threeOptions, 1, 5)).not.toThrow(
      InstructionError
    )
    expect(() => checkOptionCount(fourOptions, 2, 4)).not.toThrow(
      InstructionError
    )
  })

  it('should return false or throw when option count not match', function () {
    expect(isOptionCountValid([], 1)).toBe(false)
    expect(isOptionCountValid(oneOption, 7)).toBe(false)
    expect(isOptionCountValid(threeOptions, 0)).toBe(false)
    expect(isOptionCountValid(fourOptions, 3)).toBe(false)

    let tooLessError = new InstructionError(
      `Not enough options provided expected at least 2.`
    )
    let tooMuchError = new InstructionError(
      `Too much options provided expected 1 at most.`
    )
    expect(() => checkOptionCount([], 2)).toThrow(tooLessError)
    expect(() => checkOptionCount(oneOption, 2)).toThrow(tooLessError)
    expect(() => checkOptionCount(threeOptions, 1)).toThrow(tooMuchError)
    expect(() => checkOptionCount(fourOptions, 1)).toThrow(tooMuchError)
  })
  it('should return false or throw when option count not within range', function () {
    expect(isOptionCountValid([], 1, 1)).toBe(false)
    expect(isOptionCountValid(oneOption, 2, 4)).toBe(false)
    expect(isOptionCountValid(threeOptions, 0, 2)).toBe(false)
    expect(isOptionCountValid(fourOptions, 8, 12)).toBe(false)

    let tooLessError = new InstructionError(
      `Not enough options provided expected at least 8.`
    )
    let tooMuchError = new InstructionError(
      `Too much options provided expected 0 at most.`
    )
    expect(() => checkOptionCount([], 8, 16)).toThrow(tooLessError)
    tooLessError.message = `Not enough options provided expected at least 2.`
    expect(() => checkOptionCount(oneOption, 2, 5)).toThrow(tooLessError)
    expect(() => checkOptionCount(threeOptions, 0, 0)).toThrow(tooMuchError)
    tooMuchError.message = `Too much options provided expected 3 at most.`
    expect(() => checkOptionCount(fourOptions, 2, 3)).toThrow(tooMuchError)
  })
  it('should throw error when range is invalid', function () {
    let maxBeforeMinError = new InstructionError(
      'Range max should be bigger value than min.'
    )
    let negativeValueError = new InstructionError(
      'Range should only include positive values.'
    )
    expect(() => isOptionCountValid(threeOptions, 5, 3)).toThrow(
      maxBeforeMinError
    )
    expect(() => isOptionCountValid(threeOptions, 2, -3)).toThrow(
      maxBeforeMinError
    )
    expect(() => isOptionCountValid(threeOptions, -2, -1)).toThrow(
      negativeValueError
    )
    expect(() => checkOptionCount(threeOptions, 4, 2)).toThrow(
      maxBeforeMinError
    )
    expect(() => checkOptionCount(threeOptions, -3, 2)).toThrow(
      negativeValueError
    )
  })
})

describe('test isImmediate function', function () {
  it('should return true for immediate', function () {
    expect(isImmediate('#124')).toBe(true)
    expect(isImmediate('#0x124')).toBe(true)
    expect(isImmediate('#0xfe')).toBe(true)
  })

  it('should return false for not immediate', function () {
    expect(isImmediate('5#')).toBe(false)
    expect(isImmediate('78')).toBe(false)
    expect(isImmediate('abc')).toBe(false)
    expect(isImmediate('0x5d5')).toBe(false)
  })
})

describe('test isLowRegister function', () => {
  it('should return true for isLowRegister', () => {
    expect(isLowRegister('R0')).toBe(true)
    expect(isLowRegister('R1')).toBe(true)
    expect(isLowRegister('R2')).toBe(true)
    expect(isLowRegister('R3')).toBe(true)
    expect(isLowRegister('R4')).toBe(true)
    expect(isLowRegister('R5')).toBe(true)
    expect(isLowRegister('R6')).toBe(true)
    expect(isLowRegister('R7')).toBe(true)
  })
  it('should return false for isLowRegister', () => {
    expect(isLowRegister('R8')).toBe(false)
    expect(isLowRegister('R9')).toBe(false)
    expect(isLowRegister('R10')).toBe(false)
    expect(isLowRegister('R11')).toBe(false)
    expect(isLowRegister('R12')).toBe(false)
    expect(isLowRegister('SP')).toBe(false)
    expect(isLowRegister('LR')).toBe(false)
    expect(isLowRegister('PC')).toBe(false)
    expect(isLowRegister('APSR')).toBe(false)
    expect(isLowRegister('TEST')).toBe(false)
  })
})
