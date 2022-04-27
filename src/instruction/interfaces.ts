import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { Halfword, Word } from 'types/binary'

/**
 * Represents a list of label offsets.
 */
export interface ILabelOffsets {
  /**
   * The offset to the label in range -2147483648 to 2147483647 (signed 32 bit).
   */
  [name: string]: Word
}

/**
 * Represents an encoder of an instruction.
 */
export interface IInstructionEncoder {
  /**
   * The name of the instruction.
   */
  name: string

  /**
   * The length of the instruction in halfwords.
   */
  opcodeLength: number

  /**
   * Defines whether this instruction needs labels or not.
   */
  needsLabels: boolean

  /**
   * Checks wheter this encoder can encode the instruction with the
   * specified name and options.
   *
   * @param name the name of the instruction
   * @param options the options of the instruction
   */
  canEncodeInstruction(name: string, options: string[]): boolean

  /**
   * Encodes the instruction into its opcode.
   *
   * @param options the options of the instruction
   * @param labels the labels with their offsets relative to this instruction
   * @returns the encoded opcode as an array of halfwords
   */
  encodeInstruction(options: string[], labels?: ILabelOffsets): Halfword[]
}

/**
 * Represents an executor of an instruction.
 */
export interface IInstructionExecutor {
  /**
   * The opcode pattern of the instruction.
   */
  pattern: string

  /**
   * The length of the instruction in halfwords.
   */
  opcodeLength: number

  /**
   * Executes the instruction represented by the specified opcode.
   *
   * @param opcode the opcode of the instruction to be executed
   */
  executeInstruction(
    opcode: Halfword[],
    registers: Registers,
    memory: IMemory
  ): void
}

/**
 * Represents an encodable and executable instruction.
 */
export interface IInstruction
  extends IInstructionEncoder,
    IInstructionExecutor {}

export interface IInstructionSet {
  /**
   * Gets the instruction encoder for the instruction with the specified name and options.
   *
   * @param name the name of the instruction
   * @param options the options which are used for instruction
   * @returns the instruction encoder for the instruction
   * @throws when the instruction encoder could not be found
   */
  getEncoder(name: string, options: string[]): IInstructionEncoder

  /**
   * Gets the instruction executor for the instruction with the specified opcode.
   *
   * @param opcode the opcode of the instruction
   * @returns the instruction executor for the instruction
   * @throws when the instruction executor could not be found
   */
  getExecutor(opcode: Halfword): IInstructionExecutor
}
