export class Instruction {
    command: Command
    parameters: string[]

    public constructor (command: Command, params: string[]) {
        this.command = command
        this.parameters = params
    }
}

export enum Command {
    Mov = 'MOV',
    Movs = 'MOVS'
}