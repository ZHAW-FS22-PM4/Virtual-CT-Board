export enum AreaType {
  Code,
  Data
}

export interface IArea {
  type: AreaType
  name: string
  isReadOnly: boolean
  instructions: IInstruction[]
}

export interface IInstruction {
  name: string
  label: string
  options: string[]
}

export interface ICode {
  constants: any
  areas: IArea[]
}
