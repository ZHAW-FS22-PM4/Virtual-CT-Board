import { ICode } from './ast'
import { IObjectFile } from './objectFile'

import InstructionSet from 'instruction/set'

export function encode (code: ICode): IObjectFile {
  const opcode = InstructionSet.getEncoder('MOV').encodeInstruction(['R1', 'R2'], {})
  throw new Error('Not yet implemented.')
}
