import { Instruction } from "./instruction";

export class Area {
    instructions: Instruction[];

    public constructor (instructions: Instruction[]) {
        this.instructions = instructions
    }

    public addInstruction(instruction: Instruction) {
        this.instructions.push(instruction)
    }
}
 