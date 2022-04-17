import { IMemory } from 'board/memory/interfaces'
import { Registers } from 'board/registers'
import { ILabelOffsets } from 'instruction/interfaces'
import {
    checkOptionCount,
    create,
    createLowRegisterBits,
    getBits, isImmediate, isOptionCountValid,
    setBits
} from 'instruction/opcode'
import {Halfword, Word} from 'types/binary'
import { BaseInstruction } from '../base'

/**
 * Represents a 'STORE' instruction - STR (immediate offset) - word
 */
export class mvns extends BaseInstruction {
    public name: string = 'MVNS'
    public pattern: string =        '0100001111XXXXXX'
    private rdPattern: string =    '0100001111000XXX'
    private rmPattern: string =     '0100001111XXX000'
    private expectedOptionCount: number = 2

    public canEncodeInstruction(name: string, options: string[]): boolean {
        return (
            super.canEncodeInstruction(name, options) &&
            isOptionCountValid(options, this.expectedOptionCount) &&
            !isImmediate(options[0]) &&
            !isImmediate(options[1])
        )
    }

    public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
        checkOptionCount(options, 2)
        let opcode: Halfword = create(this.pattern)
        opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[1]))
        opcode = setBits(opcode, this.rdPattern, createLowRegisterBits(options[0]))
        return opcode
    }

    public executeInstruction(
        opcode: Halfword,
        registers: Registers,
        memory: IMemory
    ): void {

        let valueToWrite = registers.readRegister(getBits(opcode, this.rmPattern).value).toBinaryString()

        // todo
        let valueToWrie = Word.fromUnsignedInteger(
            (registers.readRegister(getBits(opcode, this.rmPattern).value).toUnsignedInteger() &
                registers.readRegister(getBits(opcode, this.rmPattern).value).toUnsignedInteger())
        )
        //registers.writeRegister(getBits(opcode, this.rdnPattern).value, valueToWrite)
    }
}

