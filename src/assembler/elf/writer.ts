import { Byte, Word } from 'types/binary'
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

export class FileWriter {
  private readonly file: IELF

  constructor(file: IELF) {
    this.file = file
  }

  public getCurrentSegment(): ISegment {
    return this.file.segments[this.file.segments.length - 1]
  }

  public startSegment(type: SegmentType, address: Word): void {
    this.file.segments.push({
      type,
      offset: this.file.content.length,
      size: 0,
      address
    })
  }

  public endSegment(): void {
    const segment = this.getCurrentSegment()
    segment.size = this.file.content.length - segment.offset
  }

  public getCurrentSection(): ISection {
    return this.file.sections[this.file.sections.length - 1]
  }

  public getCurrentSectionOffset(): number {
    return this.file.content.length - this.getCurrentSection().offset
  }

  public startSection(type: SectionType, name: string): void {
    this.file.sections.push({
      type,
      name,
      offset: this.file.content.length,
      size: 0
    })
  }

  public endSection(): void {
    const section = this.getCurrentSection()
    section.size = this.file.content.length - section.offset
  }

  public addSymbol(symbol: ISymbol): void {
    if (symbol.name in this.file.symbols)
      throw new Error(`Symbol with name '${symbol.name}' already exists.`)
    this.file.symbols[symbol.name] = symbol
  }

  public addCodeRelocation(instruction: IInstruction, length: number): void {
    this.file.relocations.push({
      type: RelocationType.Code,
      section: this.getCurrentSection().name,
      offset: this.getCurrentSectionOffset(),
      length,
      instruction
    })
  }

  public addDataRelocation(symbol: string, length: number): void {
    this.file.relocations.push({
      type: RelocationType.Data,
      section: this.getCurrentSection().name,
      offset: this.getCurrentSectionOffset(),
      length,
      symbol
    })
  }

  public mapLine(line: number): void {
    this.file.sourceMap.mapLine(
      this.getCurrentSection().name,
      this.getCurrentSectionOffset(),
      line
    )
  }

  public writeBytes(bytes: Byte[]): void {
    this.file.content.push(...bytes)
  }

  public setBytes(offset: number, bytes: Byte[]): void {
    const section = this.getCurrentSection()
    setBytes(this.file, section.offset + offset, bytes)
  }
}
