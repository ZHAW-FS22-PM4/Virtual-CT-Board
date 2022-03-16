import { Halfword } from 'types/binary'
import { IInstruction, IInstructionEncoder, IInstructionExecutor } from './interfaces'
import { match } from './opcode'

interface IInstructionRegistry {
  [name: string]: IInstruction
}

const registry: IInstructionRegistry = {}

/**
 * Adds an instruction to the instruction registry.
 * 
 * @param instruction the instruction to be added to the registry
 */
export function addInstruction(instruction: IInstruction): void {
  registry[instruction.name] = instruction
}

/**
 * Gets the instruction encoder for the instruction with the specified name.
 * 
 * @param name the name of the instruction
 * @returns the instruction encoder for the instruction
 * @throws when the instruction encoder could not be found 
 */
export function getEncoder(name: string): IInstructionEncoder {
  if (name in registry[name]) {
    return registry[name]
  }
  throw new Error(`Unable to find instruction encoder for instruction '${name}'.`)
}

/**
 * Gets the instruction executor for the instruction with the specified opcode.
 * 
 * @param opcode the opcode of the instruction
 * @returns the instruction executor for the instruction
 * @throws when the instruction executor could not be found
 */
export function getExecutor(opcode: Halfword): IInstructionExecutor {
    for (const instruction of Object.values(registry)) {
        if (match(opcode, instruction.pattern)) {
            return instruction
        }
    }
    throw new Error(`Unable to find instruction executor for the opcode '${opcode.toHexString()}'.`)
}