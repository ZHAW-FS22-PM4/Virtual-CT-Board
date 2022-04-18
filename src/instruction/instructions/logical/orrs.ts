import { IMemory } from 'board/memory/interfaces'
import { Registers} from 'board/registers'
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
import {evaluateZeroAndNegativeFlags} from "../../../board/alu";

/**
 * Represents a 'Bitwise OR' instruction - ORRS
 */
export class OrrsInstruction extends BaseInstruction {
    public name: string = 'ORRS'
    public pattern: string =        '0100001100XXXXXX'
    private rdnPattern: string =    '0100001100000XXX'
    private rmPattern: string =     '0100001100XXX000'
    private expectedOptionCount: number = 3

    public canEncodeInstruction(name: string, options: string[]): boolean {
        return (
            super.canEncodeInstruction(name, options) &&
            isOptionCountValid(options, this.expectedOptionCount) &&
            (options[0] == options[1]) &&
            !isImmediate(options[0]) &&
            !isImmediate(options[2])
        )
    }

    public encodeInstruction(options: string[], labels: ILabelOffsets): Halfword {
        checkOptionCount(options, 3)
        let opcode: Halfword = create(this.pattern)
        opcode = setBits(opcode, this.rmPattern, createLowRegisterBits(options[2]))
        opcode = setBits(opcode, this.rdnPattern, createLowRegisterBits(options[0]))
        return opcode
    }

    public executeInstruction(
        opcode: Halfword,
        registers: Registers,
        memory: IMemory
    ): void {
        let calculatedValue = Word.fromUnsignedInteger(
            ((registers.readRegister(getBits(opcode, this.rdnPattern).value).toUnsignedInteger() |
                registers.readRegister(getBits(opcode, this.rmPattern).value).toUnsignedInteger()))
            >>> 0) // need to shift 0 bits to right to get an unsigned number

        registers.setFlags(evaluateZeroAndNegativeFlags(calculatedValue))
        registers.writeRegister(getBits(opcode, this.rdnPattern).value, calculatedValue)
    }
}

