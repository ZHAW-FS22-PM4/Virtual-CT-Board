import { Byte, Word } from 'types/binary'

/**
 * Represents the section of an object file.
 */
export interface ISection {
  offset: Word
  content: Byte[]
}

/**
 * Represents an object file which is composed of multiple sections.
 */
export interface IObjectFile {
  sections: ISection[]
}
