import { ICode } from './ast'
import { IObjectFile } from './objectFile'

import { Word } from '../types/binary/word'

import InstructionSet from 'instruction/set'
import { NoEncoderFoundError } from 'types/error'

export function encode(code: ICode): IObjectFile {
  const opcode: IObjectFile = { sections: [] }

  //TODO correct offset for section
  opcode.sections.push({ content: [], offset: Word.fromUnsignedInteger(0) })

  code.areas.forEach((area, index) => {
    area.instructions.forEach((instr, idx) => {
      //InstructionSet.getEncoder("MOV").encodeInstruction(["R1", "R2"], {});
      try {
        const instrContent = InstructionSet.getEncoder(instr.name)
          .encodeInstruction(instr.params, {})
          .toBytes()
        //TODO correct offset for instruction
        opcode.sections.push({
          content: instrContent,
          offset: Word.fromUnsignedInteger(idx * 4)
        })
        return true
      } catch (e) {
        if (e instanceof NoEncoderFoundError) {
          opcode.sections.push({
            content: [],
            offset: Word.fromUnsignedInteger(idx * 4)
          })
        } else {
          //rethrow remaining errors
          throw e
        }
        return false
      }
    })
  })

  console.error('encoder.encode: implemented with flaws')
  return opcode
}
