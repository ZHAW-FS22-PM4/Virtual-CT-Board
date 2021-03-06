import { Register, Registers } from 'board/registers'
import { InstructionError } from 'instruction/error'
import { ILabelOffsets } from 'instruction/interfaces'
import { $enum } from 'ts-enum-util'
import { Halfword, Word } from 'types/binary'

/**
 * If pattern length is not valid throws an error since should never happen.
 * @param pattern pattern to check
 */
function checkPatternLength(pattern: string) {
  if (pattern.length !== 16) {
    throw new Error(
      'Opcode pattern length is invalid. Must be 16 characters long.'
    )
  }
}

/**
 * If character within pattern is not one of the valid characters throws an error since should never happen.
 * @param char character of pattern to check
 */
function checkPatternCharacter(char: string) {
  if (!['0', '1', 'X'].includes(char)) {
    throw new Error(
      'Opcode pattern contains invalid characters. Only 1, 0 or X are valid pattern characters.'
    )
  }
}

/**
 * Matches an opcode (as a halfword) with a bit pattern (as a string).
 *
 * @param opcode the opcode as a halfword
 * @param pattern the pattern as a string
 * @returns 'true' in case the opcode matches the pattern, otherwise 'false'
 */
export function match(opcode: Halfword, pattern: string): boolean {
  checkPatternLength(pattern)
  for (let i = 0; i < 16; i++) {
    const character = pattern[i]
    checkPatternCharacter(character)
    const mask = 1 << (15 - i)
    const isBitSet = (opcode.value & mask) !== 0
    if (isBitSet && character === '0') {
      return false
    }
    if (!isBitSet && character === '1') {
      return false
    }
  }
  return true
}

/**
 * Creates an opcode from a given pattern
 *
 * @param pattern opcode pattern of the instruction (has to be 16 bits digits long)
 * @returns halfword with the created opcode
 */
export function create(pattern: string): Halfword {
  checkPatternLength(pattern)
  let opcode: number = 0
  for (let i = 0; i < 16; i++) {
    const character = pattern[i]
    checkPatternCharacter(character)
    if (character === '1') {
      const mask = 1 << (15 - i)
      opcode |= mask
    }
  }
  return Halfword.fromUnsignedInteger(opcode)
}

/**
 * Sets the bits of an opcode given in a pattern according to the given value
 * Zeros are not set, only ones!
 * e.g.: opcode: 0011010001110001 pattern: 0001110011000XXX, value 110
 *  -> opcode 0011010001110111
 *
 * @param opcode opcode to change
 * @param pattern defines which bits have to be set (has to be 16 bits digits long)
 * @param value value to be set at the defined bits
 * @returns given opcode with the bits set (defined by pattern and value)
 */
export function setBits(
  opcode: Halfword,
  pattern: string,
  value: Halfword
): Halfword {
  checkPatternLength(pattern)
  let opcodeNr: number = opcode.value
  let bitsToChange: number = (pattern.match(/X/g) || []).length
  if (bitsToChange === 0) {
    return opcode
  }
  let valueString: string = value.toBinaryString().slice(16 - bitsToChange)
  let k = 0
  for (let i = 0; i < 16; i++) {
    const character = pattern[i]
    checkPatternCharacter(character)

    if (character === 'X') {
      if (valueString[k] === '1') {
        const mask = 1 << (15 - i)
        opcodeNr |= mask
      }
      k++
    }
  }
  return Halfword.fromUnsignedInteger(opcodeNr)
}

/**
 * Gets defined bits of an opcode
 *
 * @param opcode opcode to get the bits from
 * @param pattern defines which bits are returned (has to be 16 bits digits long)
 * @returns the chosen bits as halfword
 */
export function getBits(opcode: Halfword, pattern: string): Halfword {
  checkPatternLength(pattern)
  let valueString: string = ''
  for (let i = 0; i < 16; i++) {
    const character = pattern[i]
    checkPatternCharacter(character)
    if (character === 'X') {
      const mask = 1 << (15 - i)
      if ((opcode.value & mask) !== 0) {
        valueString = valueString.concat('1')
      } else {
        valueString = valueString.concat('0')
      }
    }
  }
  if (valueString === '') {
    valueString = '0'
  }
  return Halfword.fromUnsignedInteger(parseInt(valueString, 2))
}

/**
 * Gets defined bits of an opcode and multiplies value by given factor (needed for immediate which are stored with shift)
 *
 * @param opcode opcode to get the bits from
 * @param pattern defines which bits are returned (has to be 16 bits digits long)
 * @param lsbZeroBitCount the value will be left shifted by specified amount (multiplied)
 * @returns the chosen bits as halfword multiplied by correct amount
 */
export function getImmediateBits(
  opcode: Halfword,
  pattern: string,
  lsbZeroBitCount: number = 0
): Halfword {
  const valueOnPattern = getBits(opcode, pattern)
  return Halfword.fromUnsignedInteger(valueOnPattern.value << lsbZeroBitCount)
}

/**
 * Creates opcode for low register or throws an InstructionError to let user know that a low register was expected.
 * @param option register string to convert to opcode
 * @returns halfword with bits set for a low register
 */
export function createLowRegisterBits(option: string): Halfword {
  let register: Register = getEnumValueForRegisterString(option)
  if (!Registers.isLowRegister(register)) {
    throw new InstructionError('Provided register is not a low register.')
  }
  return Halfword.fromUnsignedInteger(register)
}

/**
 * Creates opcode for any register or throws an InstructionError if provided string is not a valid register.
 * @param option register string to convert to opcode
 * @returns halfword with bits set for a register
 */
export function createRegisterBits(option: string): Halfword {
  let register: Register = getEnumValueForRegisterString(option)
  return Halfword.fromUnsignedInteger(register)
}

/**
 * Creates opcode for immediate or throws an InstructionError if string is not a valid immediate
 * @param option immediate string to convert to opcode
 * @param immediateBitCount how many bits can be used to represent the immediate value
 * @param lsbZeroBitCount the value must have at least specified amount of zeros on the right side (LSB)
 * @returns halfword with bits set for an immediate
 */
export function createImmediateBits(
  option: string,
  immediateBitCount: number,
  lsbZeroBitCount: number = 0
): Halfword {
  if (!isImmediate(option)) {
    throw new InstructionError(
      'Is not an immediate value (should start with #).'
    )
  }

  let optionValue = +option.substring(1).trim()
  if (lsbZeroBitCount !== 0) {
    if (optionValue % (lsbZeroBitCount * 2) !== 0) {
      throw new InstructionError(
        `Immediate offset not ${
          lsbZeroBitCount === 2
            ? 'word'
            : lsbZeroBitCount === 1
            ? 'halfword'
            : lsbZeroBitCount + ' bytes'
        } aligned`
      )
    }

    optionValue = optionValue >> lsbZeroBitCount
  }
  let immediateBits = Halfword.fromUnsignedInteger(optionValue)
  if (
    immediateBits
      .toBinaryString()
      .startsWith('0'.repeat(16 - immediateBitCount))
  ) {
    return immediateBits
  }
  throw new InstructionError(
    'Immediate value uses too much bits (try with a smaller number).'
  )
}

/**
 * Checks wheter max is bigger value than min and if provided values are positive
 * @param minCount
 * @param maxCount
 * @returns
 */
function checkValidPositiveRange(minCount: number, maxCount: number): void {
  if (minCount > maxCount) {
    throw new Error('Range max should be bigger value than min.')
  }
  if (minCount < 0 || maxCount < 0) {
    throw new Error('Range should only include positive values.')
  }
}

/**
 * Convenience method to throw an InstructionError if encoder is not called with the right amount of options.
 * @param options parameter provided to encodeInstruction method
 * @param minCount how many options were expected by the assembly command
 * @param maxCount if not provided set to minCount (so exactly minCount is required)
 */
export function checkOptionCount(
  options: string[],
  minCount: number,
  maxCount: number = minCount
): void {
  checkValidPositiveRange(minCount, maxCount)
  if (options.length < minCount) {
    throw new InstructionError(
      `Not enough options provided expected at least ${minCount}.`
    )
  }
  if (options.length > maxCount) {
    throw new InstructionError(
      `Too much options provided expected ${maxCount} at most.`
    )
  }
}

/**
 * Convenience method to throw an InstructionError if encoder is not called with correctly set brackets.
 * If only min count is provided last param has to have opening and closing brackets and
 * other wise opening on second last and closing on last param.
 * @param options parameter provided to encodeInstruction method
 * @param optionCountMin count of options
 * @param optionCountMax if immediate can be ommited on higher than min count
 */
export function checkBracketsOnLastOptions(
  options: string[],
  optionCountMin: number,
  optionCountMax: number = optionCountMin
): void {
  if (
    optionCountMax - optionCountMin !== 0 &&
    optionCountMax - optionCountMin !== 1
  ) {
    throw Error(
      'Provided option count is more than one apart or max is smaller than min'
    )
  }
  if (optionCountMin !== optionCountMax && options.length === optionCountMin) {
    if (!registerStringEnclosedInBrackets(options[optionCountMin - 1])) {
      throw new InstructionError(
        `Opening or closing bracket missing for ${optionCountMin}. param`
      )
    }
  } else if (
    options.length === optionCountMax &&
    !registerStringHasBrackets(
      options[optionCountMax - 2],
      options[optionCountMax - 1]
    )
  ) {
    throw new InstructionError(
      `Opening bracket on ${
        optionCountMax - 1
      }. param or closing bracket on ${optionCountMax}. param`
    )
  }
}

/**
 * Convenience method to return boolean wheter the option count is satisfied or not
 * @param options parameter provided to canEncodeInstruction method
 * @param minCount how many options were expected by the assembly command
 * @param maxCount if not provided set to minCount (so exactly minCount is required)
 */
export function isOptionCountValid(
  options: string[],
  minCount: number,
  maxCount: number = minCount
): boolean {
  checkValidPositiveRange(minCount, maxCount)
  if (options.length < minCount || options.length > maxCount) {
    return false
  }
  return true
}

/**
 * Determine if string is PC register or not
 * @param possiblePCRegister immedate to check
 * @returns true if it is an immediate
 */
export function isPCRegister(possiblePCRegister: string): boolean {
  return possiblePCRegister.includes('PC')
}

/**
 * Determine if string is immediate or not
 * @param possibleImmediate immedate to check
 * @returns true if it is an immediate
 */
export function isImmediate(possibleImmediate: string): boolean {
  return removeBracketsFromRegisterString(possibleImmediate).startsWith('#')
}

/**
 * Determines if string is low register.
 * @param possibleLowRegister string value to check
 * @returns true if low register
 */
export function isLowRegister(possibleLowRegister: string): boolean {
  let register = $enum(Register).getValueOrDefault(
    possibleLowRegister,
    Register.R12
  )
  return Registers.isLowRegister(register)
}

/**
 * Converts a String to an enum of Register. If not possible an InstructionError is thrown
 * @param option string to convert
 * @returns valid value for enum Register
 */
export function getEnumValueForRegisterString(option: string): Register {
  try {
    return $enum(Register).getValueOrThrow(option)
  } catch (e) {
    throw new InstructionError(`Option '${option}' is not a valid register.`)
  }
}

/**
 * Removes the brackets from register strings.
 * @param registerString on which the brackets should get be removed
 * @returns the registerString without the brackets
 */

export function removeBracketsFromRegisterString(
  registerString: string
): string {
  return registerString.replace('[', '').replace(']', '').trim()
}

/**
 * Checks if the brackets are set correct on the register strings.
 * @param registerString1 where to check for the left bracket
 * @param registerString2 where to check for the right bracket
 * @returns true if the brackets are set correct
 */
export function registerStringHasBrackets(
  registerString1: string,
  registerString2: string
): boolean {
  return registerString1.startsWith('[') && registerString2.endsWith(']')
}

/**
 * Checks if the brackets are set correct on the register string.
 * @param registerString where to check for the left bracket and right bracket
 * @returns true if the brackets are set correct
 */
export function registerStringEnclosedInBrackets(
  registerString: string
): boolean {
  return registerString.startsWith('[') && registerString.endsWith(']')
}

/**
 * Makes sure pointer is dividable by provided byte count
 * @param pointer pointer which is used to navigate from
 * @param byteCount make pointer dividable by this value
 * @returns word aligned pointer
 */
export function alignPointer(pointer: number, byteCount: number): number {
  if (byteCount <= 0) {
    throw new Error('Byte count must be positive value.')
  }
  while (pointer % byteCount !== 0) {
    pointer++
  }
  return pointer
}

/**
 * Determines whether the specified string is a
 * a literal (all except valid register, and strings containing any brackets)
 *
 * @param option string provided as param which could be literal
 * @returns whether the string is a literal part of pseudo instruction
 */
export function isLiteralString(option: string): boolean {
  try {
    $enum(Register).getValueOrThrow(option)
    return false
  } catch (e) {
    return !option.includes('[') && !option.includes(']')
  }
}

/**
 * Returns the offset value to use for the provided label option.
 * Throws an error if labels are provided but given was is not defined
 *
 * @param labelOption string provided as param which could be literal
 * @param labels the labels with their offsets relative to this instruction
 * @returns
 */
export function mapLabelOffset(
  labelOption: string,
  labels?: ILabelOffsets
): Word {
  if (labels && !labels[labelOption]) {
    throw new InstructionError(`Symbol '${labelOption}' is not defined.`)
  }
  return labels
    ? Word.fromUnsignedInteger(labels[labelOption].value)
    : Word.fromUnsignedInteger(0)
}
