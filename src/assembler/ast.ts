export enum AreaType {
  Code = 'CODE',
  Data = 'DATA'
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
  params: string[]
}

export interface ICode {
  constants: any
  areas: IArea[]
}
