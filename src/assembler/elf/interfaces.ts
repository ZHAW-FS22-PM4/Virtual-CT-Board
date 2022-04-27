import { Byte, Word } from 'types/binary'
import { IInstruction } from '../ast'
import { SourceMap } from './debug'

/**
 * An enumeration of segment types.
 */
export enum SegmentType {
  /**
   * Instructs that this segment shall be loaded to physical memory before execution.
   */
  Load
}

/**
 * Represents a part of a file mapped to physical memory.
 */
export interface ISegment {
  /**
   * The type of segment.
   */
  type: SegmentType

  /**
   * The offset at which this segment starts in the file.
   */
  offset: number

  /**
   * The size of this segment in the file.
   */
  size: number

  /**
   * The target address of this segment in physical memory.
   */
  address: Word
}

/**
 * An enumeration of section types used during linking.
 */
export enum SectionType {
  /**
   * A code section which contains executable code or literal constants.
   */
  Code,

  /**
   * A data section which contains data.
   */
  Data
}

/**
 * Represents a part of a file which acts as one unit during linking operations.
 */
export interface ISection {
  /**
   * The type of section.
   */
  type: SectionType

  /**
   * The name of the section
   */
  name: string

  /**
   * The offset at which this section starts in the file.
   */
  offset: number

  /**
   * The size of this section in the file.
   */
  size: number
}

/**
 * An enumeration of symbol types.
 */
export enum SymbolType {
  /**
   * Defines a constant symbol (defined with EQU).
   */
  Constant,

  /**
   * Defines a logical address (defined with a label).
   */
  Address
}

/**
 * Represents a symbol which defines a word value of a specific type.
 */
export interface ISymbol {
  /**
   * The type of symbol.
   */
  type: SymbolType

  /**
   * The name of the symbol.
   */
  name: string

  /**
   * An optional section in which this symbol is defined.
   */
  section?: string

  /**
   * The word value of this symbol.
   */
  value: Word
}

/**
 * Represents a table of symbols.
 */
export interface ISymbolTable {
  [name: string]: ISymbol
}

/**
 * An enumeration of re-location types which must be handled during linking.
 */
export enum RelocationType {
  /**
   * Instructs that code needs to be updated which depedends on the definition of a symbol.
   */
  Code,

  /**
   * Instructs that data needs to be updated which was defined by a symbol.
   */
  Data
}

/**
 * Allows update of code or data which was defined by using a symbol.
 */
export interface IRelocation {
  /**
   * The type of re-location.
   */
  type: RelocationType

  /**
   * The section in which this re-location must be applied.
   */
  section: string

  /**
   * The offset in the section in which this re-location must be applied.
   */
  offset: number

  /**
   * The lenth of the code or data (in bytes).
   */
  length: number

  /**
   * The instruction which will be used for code re-location.
   */
  instruction?: IInstruction

  /**
   * The symbol which will be used for data re-locations.
   */
  symbol?: string
}

/**
 * Represents an executable and linkable file which is inspired by the ELF format.
 */
export interface IELF {
  /**
   * A list of segments which give instructions on how this file can be executed.
   */
  segments: ISegment[]

  /**
   * The sections which are units of code or data which can be manipulated during linking.
   */
  sections: ISection[]

  /**
   * The symbol table which contains the definitions of the symbols available in the file.
   */
  symbols: ISymbolTable

  /**
   * A list of re-locations which must be updated when sections are moved during linking.
   */
  relocations: IRelocation[]

  /**
   * The source map which maps addresses to line numbers in the original source for the file.
   */
  sourceMap: SourceMap

  /**
   * The actual content of the file as an array of bytes.
   */
  content: Byte[]
}
