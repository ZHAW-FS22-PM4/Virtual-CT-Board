import { Byte, Word } from 'types/binary'

export enum SegmentType {
  LOAD
}

export interface ISegment {
  type: SegmentType
  offset: Word
  size: Word
  address: Word
}

export interface ISectionTable {
  [name: string]: {
    offset: Word
    size: Word
  }
}

export interface ISymbolTable {
  [name: string]: {
    section: string
    offset: Word
  }
}

export interface IELF {
  segments: ISegment[]
  sections: ISectionTable
  symbols: ISymbolTable
  content: Byte[]
}
