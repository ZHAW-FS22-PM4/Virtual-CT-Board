import { ILabelOffsets } from 'instruction/interfaces'
import { Byte, Halfword, Word } from 'types/binary'
import { SourceMap } from './debug'
import {
  IELF,
  ISection,
  ISegment,
  ISymbol,
  SectionType,
  SymbolType
} from './interfaces'

/**
 * Creates an empty file.
 *
 * @returns a new empty file
 */
export function createFile(): IELF {
  return {
    segments: [],
    sections: [],
    symbols: {},
    relocations: [],
    sourceMap: new SourceMap(),
    content: []
  }
}

/**
 * Gets the segment at the specified offset.
 *
 * @param file the file
 * @param offset the offset in the file
 * @returns the segment at this offset
 */
export function getSegment(file: IELF, offset: number): ISegment {
  const segment = file.segments.filter((x) => x.offset <= offset).at(-1)
  if (!segment)
    throw new Error(`Could not find segment at offset ${offset} in file.`)
  return segment
}

/**
 * Gets the physical address in a file using a file offset.
 *
 * @param file the file
 * @param offset the offset in the file
 * @returns the physical memory address
 */
export function getAddressInFile(file: IELF, offset: number): Word {
  const segment = getSegment(file, offset)
  return getAddressInSegment(segment, offset - segment.offset)
}

/**
 * Gets the physical address in a segment using a segment offset.
 *
 * @param segment the segment
 * @param offset the offset in the file
 * @returns the physical memory address
 */
export function getAddressInSegment(segment: ISegment, offset: number): Word {
  return segment.address.add(offset)
}

/**
 * Gets all sections of the specified type.
 *
 * @param file the file
 * @param type the type of section
 * @returns all sections of the specified type
 */
export function getSectionsOfType(file: IELF, type: SectionType): ISection[] {
  return file.sections.filter((x) => x.type === type)
}

/**
 * Gets the section with the specified name.
 *
 * @param file the file
 * @param name the name of the section
 * @returns the section
 */
export function getSection(file: IELF, name: string): ISection {
  const section = file.sections.find((x) => x.name === name)
  if (!section) throw new Error(`Could not find section '${name}' in file.`)
  return section
}

/**
 * Gets the symbols of a section.
 *
 * @param file the file
 * @param section the section
 * @returns all symbols in the section
 */
export function getSymbolsFromSection(file: IELF, section: string): ISymbol[] {
  return Object.values(file.symbols).filter((x) => x.section === section)
}

/**
 * Gets all the symbols of a specific type.
 *
 * @param file the file
 * @param file the filearam type the type of symbol
 * @returns all symbols of the specified type
 */
export function getSymbolsOfType(file: IELF, type: SymbolType): ISymbol[] {
  return Object.values(file.symbols).filter((x) => x.type === type)
}

/**
 * Gets the offset of the labels relative to the specified address.
 *
 * @param file the file
 * @param address the physical memory address
 * @returns the offsets for each label
 */
export function getLabelOffsets(file: IELF, address: Word): ILabelOffsets {
  const labels: ILabelOffsets = {}
  for (const symbol of getSymbolsOfType(file, SymbolType.Address)) {
    labels[symbol.name] = Halfword.fromUnsignedInteger(
      symbol.value.value - address.value
    )
  }
  return labels
}

/**
 * Sets the bytes at the specified offset in the file.
 *
 * @param file the file
 * @param offset the offset at which the bytes should be overwritten
 * @param bytes the bytes which should be inserted
 */
export function setBytes(file: IELF, offset: number, bytes: Byte[]): void {
  for (let i = 0; i < bytes.length; i++) {
    file.content[offset + i] = bytes[i]
  }
}
