import { Halfword } from 'types/binary'

/**
 * Represents a list of label offsets.
 */
export interface ILabelOffsets {
  [name: string]: Halfword
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
   * Encodes the instruction into its opcode.
   * 
   * @param options the options of the instruction
   * @param labels the offsets (as halfwords) of the labels
   * @returns the encoded opcode as a halfword
   */
  encodeInstruction(options: string[], labels: ILabelOffsets): Halfword
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
   * Executes the instruction represented by the specified opcode.
   * 
   * @param opcode the opcode of the instruction to be executed
   */
  executeInstruction(opcode: Halfword): void
}

/**
 * Represents an encodable and executable instruction.
 */
export interface IInstruction extends IInstructionEncoder, IInstructionExecutor
{}