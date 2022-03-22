/**
 * Translates parsed code (ast representation) into object file
 */

import { ICode, AreaType, IInstruction, IArea } from './ast'
import { IObjectFile } from './objectFile'

import { Word, Byte, Halfword } from '../types/binary'

import InstructionSet from 'instruction/set'
import { VirtualBoardError, VirtualBoardErrorType } from '../types/error'

//TODO correct offset for section
const offsetCodeAreaReadOnly = Word.fromUnsignedInteger(0x08000000)
const offsetCodeArea = Word.fromUnsignedInteger(0x20000000)
const offsetDataArea = Word.fromUnsignedInteger(0x20010000)
const offsetStackArea = Word.fromUnsignedInteger(0x20010200)

export function encode(code: ICode): IObjectFile {
  const opcode: IObjectFile = { sections: [] }

  for (let area of code.areas) {
    let isCodeArea: boolean = false
    if (area.type === AreaType.Code) {
      isCodeArea = true
    }

    let areaContent: Byte[] = []

    if (isCodeArea) {
      for (let instr of area.instructions) {
        areaContent.push(...encodeCodeInstruction(instr))
      }
    } else {
      for (let instr of area.instructions) {
        areaContent.push(...encodeDataInsruction(instr, areaContent))
      }
    }

    let areaOffset: Word = determineOffset(area)

    opcode.sections.push({
      content: areaContent,
      offset: areaOffset
    })
    //TODO Constants at end of optcode (CT1 SW2 Folie 21)
  }

  console.error('encoder.encode: implemented with flaws')
  return opcode
}

function determineOffset(area: IArea): Word {
  if (area.type === AreaType.Code) {
    //TODO multiple Code sections possible
    return area.isReadOnly ? offsetCodeAreaReadOnly : offsetCodeArea
  } else if (area.type === AreaType.Data) {
    return offsetDataArea
  } else {
    throw new VirtualBoardError(
      'Not supported or no type defined for area',
      VirtualBoardErrorType.InvalidAreaType
    )
  }
}

/**
 * 
 * @param instr Instruction to encode
 * @param areaContent content of objectFile to see if filling bytes are required
 * @returns byte array for provided instruction
 */
export function encodeDataInsruction(
  instr: IInstruction,
  areaContent: Byte[]
): Byte[] {
  //not possible as encoder, since not always halfword is returned
  let objCode: Byte[] = []
  //TODO EQU as well
  if (instr.name === 'DCB') {
    //instr.params.map(s => interpretDataParam(s))

    instr.params.forEach((s) => objCode.push(...interpretDataParam(s)))
  } else if (instr.name === 'DCW') {
    //TODO always force to be Halfword (same for DCD Word)
    if (areaContent.length % 2 !== 0) {
      objCode.push(Byte.fromUnsignedInteger(0))
    }
    instr.params.forEach((s) => objCode.push(...interpretDataParam(s)))
  } else if (instr.name === 'DCD') {
    if (areaContent.length % 4 !== 0) {
      for (let i = areaContent.length % 4; i < 4; i++) {
        objCode.push(Byte.fromUnsignedInteger(0))
      }
    }
    instr.params.forEach((s) => objCode.push(...interpretDataParam(s)))
  } else if (instr.name === 'SPACE' || instr.name === '%') {
    if (instr.params.length !== 1) {
      throw new VirtualBoardError(
        'Invalid param count for SPACE',
        VirtualBoardErrorType.InvalidParamProvided
      )
    }
    //TODO should be random or as before
    for (let i = 0; i < Number.parseInt(instr.params[0]); i++) {
      objCode.push(Byte.fromUnsignedInteger(0))
    }
  }
  return objCode
}

function interpretDataParam(param: string): Byte[] {
  if (param.startsWith('0x')) {
    let value = Number(param)
    if (param.length === 4) {
      return [Byte.fromUnsignedInteger(value)]
    } else if (param.length === 6) {
      return Halfword.fromUnsignedInteger(value).toBytes()
    } else if (param.length === 10) {
      return Word.fromUnsignedInteger(value).toBytes()
    } else {
      throw new Error('Unsupported length of hex value provided')
    }
  } else {
    //TODO binary or decimal supported?
    return []
  }
}

export function encodeCodeInstruction(instr: IInstruction): Byte[] {
  //InstructionSet.getEncoder("MOV").encodeInstruction(["R1", "R2"], {});
  try {
    const instrContent = InstructionSet.getEncoder(instr.name)
      .encodeInstruction(instr.params, {})
      .toBytes()
    return instrContent
    //same as : areaContent = [...areaContent, ...instrContent]
  } catch (e) {
    if (
      e instanceof VirtualBoardError &&
      e.type === VirtualBoardErrorType.NoEncoderFound
    ) {
      //just fill with all zeros
      return Halfword.fromUnsignedInteger(0).toBytes()
    } else {
      //rethrow remaining errors
      throw e
    }
  }
}
