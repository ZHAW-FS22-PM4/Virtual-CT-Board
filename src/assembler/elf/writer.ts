import { Byte, Word } from 'types/binary'
import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'
import { IInstruction } from '../ast'
import {
  IELF,
  ISection,
  ISegment,
  ISymbol,
  RelocationType,
  SectionType,
  SegmentType
} from './interfaces'
import { setBytes } from './utils'

/**
 * Represents a file writer which can be used to write segments and sections
 * to an elf file.
 */
export class FileWriter {
  private readonly file: IELF

  constructor(file: IELF) {
    this.file = file
  }

  /**
   * Starts a new segment at the current location in the file.
   *
   * @param type the type of segment
   * @param address the physical addres of the segment
   */
  public startSegment(type: SegmentType, address: Word): void {
    this.file.segments.push({
      type,
      offset: this.file.content.length,
      size: 0,
      address
    })
  }

  /**
   * Gets the segment to which the writer currently writes.
   *
   * @returns the current segment
   */
  public getCurrentSegment(): ISegment {
    return this.file.segments[this.file.segments.length - 1]
  }

  /**
   * Ends the current segment and sets the final size.
   */
  public endSegment(): void {
    const segment = this.getCurrentSegment()
    segment.size = this.file.content.length - segment.offset
  }

  /**
   * Starts a new section at the current location.
   *
   * @param type the type of section
   * @param name the name of the section
   */
  public startSection(type: SectionType, name: string): void {
    this.file.sections.push({
      type,
      name,
      offset: this.file.content.length,
      size: 0
    })
  }

  /**
   * Gets the section to which the writer currently writes.
   *
   * @returns the current section
   */
  public getCurrentSection(): ISection {
    return this.file.sections[this.file.sections.length - 1]
  }

  /**
   * Gets the current offset relative to the current section.
   *
   * @returns the current section offset
   */
  public getCurrentSectionOffset(): number {
    return this.file.content.length - this.getCurrentSection().offset
  }

  /**
   * Ends the current section and sets the final size.
   */
  public endSection(): void {
    const section = this.getCurrentSection()
    section.size = this.file.content.length - section.offset
  }

  /**
   * Adds a new symbol to the file.
   *
   * @param symbol the symbol to add
   * @throws when the symbol is already defined in the file
   */
  public addSymbol(symbol: ISymbol): void {
    if (symbol.name in this.file.symbols)
      throw new VirtualBoardError(
        `Symbol with name '${symbol.name}' already exists.`,
        VirtualBoardErrorType.DuplicateSymbolDefinition
      )
    this.file.symbols[symbol.name] = symbol
  }

  /**
   * Adds a code re-location at the current position.
   *
   * @param instruction the instruction to be re-located
   * @param length the length of the instruction in bytes
   */
  public addCodeRelocation(instruction: IInstruction, length: number): void {
    this.file.relocations.push({
      type: RelocationType.Code,
      section: this.getCurrentSection().name,
      offset: this.getCurrentSectionOffset(),
      length,
      instruction
    })
  }

  /**
   * Adds a data re-location at the current position.
   *
   * @param symbol the symbol to be re-located
   * @param length the length of the symbol (is always 32)
   */
  public addDataRelocation(symbol: string, length: number): void {
    this.file.relocations.push({
      type: RelocationType.Data,
      section: this.getCurrentSection().name,
      offset: this.getCurrentSectionOffset(),
      length,
      symbol
    })
  }

  /**
   * Maps the current position in the file to the specified source line.
   *
   * @param line the line in the source file
   */
  public mapLine(line: number): void {
    this.file.sourceMap.mapLine(
      this.getCurrentSection().name,
      this.getCurrentSectionOffset(),
      line
    )
  }

  /**
   * Aligns the content to be specified alignment.
   *
   * @param alignment the alignment (e.g. 2 for halfword and 4 for word alignment)
   */
  public align(alignment: number): void {
    if (alignment > 1) {
      const offset = this.getCurrentSectionOffset()
      const off = offset % alignment
      if (off) {
        const fill = alignment - off
        this.file.content.push(
          ...Array(fill).fill(Byte.fromUnsignedInteger(0xff))
        )
      }
    }
  }

  /**
   * Writes the specified bytes to the file in little endian order.
   *
   * @param bytes the bytes to write
   */
  public writeBytes(bytes: Byte[], alignment?: number): void {
    if (alignment) this.align(alignment)
    this.file.content.push(...bytes)
  }

  /**
   * Sets the bytes at the specified section offset
   *
   * @param offset the offset relative to the current section
   * @param bytes the bytes to write
   */
  public setBytes(offset: number, bytes: Byte[]): void {
    if (offset < 0) throw new Error('Negative offset is not valid.')
    const section = this.getCurrentSection()
    setBytes(this.file, section.offset + offset, bytes)
  }
}
