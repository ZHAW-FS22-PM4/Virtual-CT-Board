/**
 * Represents the type of an assembler area.
 */
export enum AreaType {
  Code = 'CODE',
  Data = 'DATA'
}

/**
 * Represents an assembler area.
 */
export interface IArea {
  type: AreaType
  name: string
  isReadOnly: boolean
  instructions: IInstruction[]
}

/**
 * Represents an instruction in assembler. This is not necessarily a processor instruction since there are
 * certain assembler instructions which do not directly translate to a processor instruction.
 */
export interface IInstruction {
  name: string
  label: string
  params: string[]
}

/**
 * Represents the code of an assembler file.
 */
export interface ICodeFile {
  areas: IArea[]
}
