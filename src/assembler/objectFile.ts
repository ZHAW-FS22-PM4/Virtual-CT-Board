import { Byte, Word } from 'types/binary'

export interface ISection {
  offset: Word
  content: Byte[]
}

export interface IObjectFile {
  sections: ISection[]
}
