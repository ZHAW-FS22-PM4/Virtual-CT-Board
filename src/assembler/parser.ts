import { Instruction, InstructionName } from './instruction'
import { Area } from './area'
import { Register } from '../board/registers'

/*
    Parses a given string and return an instance of an instruction if the string is a valid assembly command
*/
export function parseInstruction (instruction: string): Instruction {
    let elements : string[] = instruction.split(' |,')
    elements.forEach(element => element.trim())

    if (isValidInstruction(elements)) return new Instruction(InstructionName[elements[0]], elements.slice(1,3))
    // else if no valid instruction
    throw new Error(`Unknown instruction '${instruction}'.`)
}

/*
    Parses multiple lines of assembly code and returns a (code) area containing valid instructions.
*/
export function parseCode (code: string): Area {
    let lines : string[] = code.split('\n')
    let instructions : Instruction[]
    for (let line of lines) {
        instructions.push(parseInstruction(line))
    }
    return new Area(instructions)
}

/*
    Checks whether first element is valid assembly command AND if 2nd and 3rd elements are valid registers
    return false otherwise
*/
export function isValidInstruction(instruction: string[]): boolean {
    if ((<any>Object).values(InstructionName).includes(instruction[0]) &&
    Object.keys(Register).includes(instruction[1]) &&
    Object.keys(Register).includes(instruction[2])) {
        return true
    }
    return false
}


