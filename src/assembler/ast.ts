export enum AreaType {
  Code = "CODE",
  Data = "DATA"
}

export function getAreaType(value: string): AreaType {
  if (value === AreaType.Code) return AreaType.Code
  if (value === AreaType.Data) return AreaType.Data
  else throw new Error('Unknown Areatype.')
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
