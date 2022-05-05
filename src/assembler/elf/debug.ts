import { Word } from 'types/binary'

/**
 * Represents a mapping of a source line.
 */
export interface ISourceLineMapping {
  section: string
  offset: number
  line: number
}

/**
 * Represents a source map which maps source lines to addresses.
 */
export class SourceMap {
  private readonly mappings: Array<ISourceLineMapping>
  private readonly addresses: Map<number, number>

  public constructor() {
    this.mappings = []
    this.addresses = new Map<number, number>()
  }

  /**
   * Maps a line in a source file.
   *
   * @param section the section in which the line is mapped to
   * @param offset the offset in the section
   * @param line the line in the source file
   */
  public mapLine(section: string, offset: number, line: number): void {
    this.mappings.push({ section, offset, line })
  }

  /**
   * Gets all mappings.
   *
   * @returns the source line mappings
   */
  public getMappings(): Array<ISourceLineMapping> {
    return this.mappings
  }

  /**
   * Maps a physical address to the line.
   *
   * @param address the phyiscal address
   * @param line the line in the source file
   */
  public mapAddress(address: Word, line: number): void {
    this.addresses.set(address.value, line)
  }

  /**
   * Gets the line which is mapped at the specified address.
   *
   * @param address the physical address
   * @returns the line in the soruce file
   */
  public getLine(address: Word): number | undefined {
    return this.addresses.get(address.value)
  }
}
