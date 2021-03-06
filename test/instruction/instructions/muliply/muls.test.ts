import { Memory } from 'board/memory'
import { Register, Registers } from 'board/registers'
import { MulsInstruction } from 'instruction/instructions/multiply/muls'
import { $enum } from 'ts-enum-util'
import { anything, instance, mock, verify, when } from 'ts-mockito'
import { Halfword, Word } from 'types/binary'

const registerOption1: string = 'R1'
const registerValue1: Word = Word.fromUnsignedInteger(0x5124)
const registerOption2: string = 'R6'
const registerValue2: Word = Word.fromUnsignedInteger(0xb316)

const mulsInstruction = new MulsInstruction()

const memoryMock: Memory = mock<Memory>()
const registerMock: Registers = mock<Registers>()
const registers: Registers = instance(registerMock)
when(
  registerMock.readRegister($enum(Register).getValueOrThrow(registerOption1))
).thenReturn(registerValue1)
when(
  registerMock.readRegister($enum(Register).getValueOrThrow(registerOption2))
).thenReturn(registerValue2)
when(registerMock.readRegister(Register.PC)).thenReturn(
  Word.fromUnsignedInteger(0x0)
)

describe('test encodeInstruction (command with options --> optcode) function', () => {
  it('should create correct opcode', function () {
    // MULS R1, R6, R1
    expect(
      mulsInstruction
        .encodeInstruction([
          registerOption1,
          registerOption2,
          registerOption1
        ])[0]
        .toBinaryString()
    ).toEqual('0100001101110001')

    // MULS R6, R1, R6
    expect(
      mulsInstruction
        .encodeInstruction([
          registerOption2,
          registerOption1,
          registerOption2
        ])[0]
        .toBinaryString()
    ).toEqual('0100001101001110')
  })

  it('should throw an error when invalid parameters are provided', function () {
    // MULS R1, R6, R2
    expect(() =>
      mulsInstruction.encodeInstruction([
        registerOption2,
        registerOption1,
        'R2'
      ])
    ).toThrow()

    // MULS R1, R8, R1
    expect(() =>
      mulsInstruction.encodeInstruction([
        registerOption2,
        'R8',
        registerOption2
      ])
    ).toThrow()
  })
})

describe('test executeInstruction function', () => {
  it('should write the correct result to the register', function () {
    // MULS R1, R6, R1
    mulsInstruction.executeInstruction(
      [Halfword.fromUnsignedInteger(0b0100001101110001)],
      registers,
      memoryMock
    )

    verify(
      registerMock.readRegister(
        $enum(Register).getValueOrThrow(registerOption1)
      )
    ).once()

    verify(
      registerMock.readRegister(
        $enum(Register).getValueOrThrow(registerOption2)
      )
    ).once()

    verify(registerMock.setFlags(anything())).called()
  })
})
