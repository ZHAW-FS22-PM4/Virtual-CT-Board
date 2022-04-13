import { AreaType, ICodeFile, IInstruction } from 'assembler/ast'
import { createInstruction, parse, removeNonCode } from 'assembler/parser'

//// create test data

// for testing removeNonCode
const testCommentsString1: string[] = [
  '; output',
  'ADDR_LED_31_0        EQU    0x60000100'
]
const testCommentsString2: string[] = [
  'ADDR_LED_31_0        EQU    0x60000100 ; address LEDs'
]
const testEmptyLinesString: string[] = ['STRH 		R7, [R1, #2]', '    ', '']

//for testing createInstructions
const movInstruction: string = 'MOV R3, R4'
const resultMovInstruction: IInstruction = {
  name: 'MOV',
  label: '',
  options: ['R3', 'R4']
}

const movsInstruction: string = 'MOVS R1, #3'
const resultMovsInstruction: IInstruction = {
  name: 'MOVS',
  label: '',
  options: ['R1', '#3']
}

const movInstructionFalse: string = 'MOVR3, R4'

const instructionWithIndent: string = '		LDR 		R7, =LCD_BACKLIGHT_OFF'
const resultInstructionWithIndent: IInstruction = {
  name: 'LDR',
  label: '',
  options: ['R7', '=LCD_BACKLIGHT_OFF']
}

const instructionWithBranch: string = 'B			display'
const resultInstructionWithBranch: IInstruction = {
  name: 'B',
  label: '',
  options: ['display']
}

const instructionWithLabel: string = 'blue			LDR			R1, =ADDR_LCD_COLOUR'
const resultInstructionWithLabel: IInstruction = {
  name: 'LDR',
  label: 'blue',
  options: ['R1', '=ADDR_LCD_COLOUR']
}

const falseInstruction1: string = 'Hello world'
const falseInstruction2: string = 'print("Hello world")'

const validCode: string =
  'AREA MyCode, CODE, READONLY\n MOVS    R1, #0xfe\n ALIGN'
const resultValidCode: ICodeFile = {
  areas: [
    {
      type: AreaType.Code,
      name: 'MyCode',
      isReadOnly: true,
      instructions: [{ name: 'MOVS', label: '', options: ['R1', '#0xfe'] }]
    }
  ]
}

const invalidCode1: string = 'MOVS    R1, #0xfe\n ALIGN'
const invalidCode2: string = 'AREA MyCode, CODE, READONLY\n MOVS    R1, #0xfe'
const invalidCode3: string =
  'AREA MyCode, CODE, READONLY MOVS    R1, #0xfe ALIGN' //TODO find out if this should really throw an error

//// tests

describe('test removeNonCode function', () => {
  it('should return code without comments in a separate line', () => {
    expect(removeNonCode(testCommentsString1)).toStrictEqual([
      'ADDR_LED_31_0        EQU    0x60000100'
    ])
  })
  it('should return code without comments on the same line', () => {
    expect(removeNonCode(testCommentsString2)).toStrictEqual([
      'ADDR_LED_31_0        EQU    0x60000100 '
    ])
  })
  it('should return code without empty lines', () => {
    expect(removeNonCode(testEmptyLinesString)).toStrictEqual([
      'STRH 		R7, [R1, #2]'
    ])
  })
})

describe('test createInstructions function', () => {
  it('should create an IInstruction from a MOV instruction', () => {
    expect(createInstruction(movInstruction)).toStrictEqual(
      resultMovInstruction
    )
  })
  it('should create an IInstruction from a MOVS instruction', () => {
    expect(createInstruction(movsInstruction)).toStrictEqual(
      resultMovsInstruction
    )
  })
  it('should throw an error for an instruction with false syntax', () => {
    expect(() => {
      createInstruction(movInstructionFalse)
    }).toThrow('Compile Error.')
  })

  it('should create a single instruction', () => {
    expect(createInstruction(instructionWithIndent)).toStrictEqual(
      resultInstructionWithIndent
    )
  })
  it('should create instruction with branch name in params', () => {
    expect(createInstruction(instructionWithBranch)).toStrictEqual(
      resultInstructionWithBranch
    )
  })
  it('should create instruction with label name in param label', () => {
    expect(createInstruction(instructionWithLabel)).toStrictEqual(
      resultInstructionWithLabel
    )
  })
  it('should throw an error for a gibberish instruction', () => {
    expect(() => {
      createInstruction(falseInstruction1)
    }).toThrow('Compile Error.')
  })
  it('should throw an error for a Java/C command', () => {
    expect(() => {
      createInstruction(falseInstruction2)
    }).toThrow('Compile Error.')
  })
})

describe('test parse function', () => {
  it('should create an ICode from an area containing a MOV instruction', () => {
    expect(parse(validCode)).toStrictEqual(resultValidCode)
  })
  it('should throw an error for a piece of code without AREA indicator', () => {
    expect(() => {
      parse(invalidCode1)
    }).toThrow('Compile Error.')
  })
  it('should throw an error for a piece of code without ALIGN indicator', () => {
    expect(() => {
      parse(invalidCode2)
    }).toThrow('Compile Error.')
  })
  it('should throw an error for a piece of code without carriage return between lines', () => {
    expect(() => {
      parse(invalidCode3)
    }).toThrow('Compile Error.')
  })
})
