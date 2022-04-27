import InstructionSet from 'instruction/set'
import { END_OF_CODE } from 'instruction/special'
import { Word } from 'types/binary'
import {
  IELF,
  ISection,
  RelocationType,
  SectionType,
  SegmentType,
  SymbolType
} from './elf/interfaces'
import {
  createFile,
  getAddressInFile,
  getAddressInSegment,
  getLabelOffsets,
  getSection,
  getSectionsOfType,
  getSymbolsFromSection,
  getSymbolsOfType,
  setBytes
} from './elf/utils'
import { FileWriter } from './elf/writer'

const FLASH_START = Word.fromUnsignedInteger(0x08000000)
const SRAM_START = Word.fromUnsignedInteger(0x20000000)
const CODE_START = Word.fromUnsignedInteger(0x08000008)
const STACK_START = Word.fromUnsignedInteger(0x20002000)

const VECTOR_TABLE = [STACK_START, CODE_START].flatMap((x) => x.toBytes())

/**
 * Creates an executable file (ELF format) from an object file (ELF format).
 *
 * The returned object file is in the following format:
 * - segments: contains the segments which need to be loaded to physical memory before execution
 *   - for each section there will be a segment created
 *   - code segments are mapped to phyiscal memory starting with FLASH_START (0x0800000)
 *   - data segments are mapped to physical memory starting with SRAM_START (0x20000000)
 * - sections: empty (not linkable)
 * - symbols: empty (not linkable)
 * - relocations: empty (not linkable)
 * - sourceMap: contains only phyiscal address mappings
 * - content: contains the code and data of the executable
 *   - code and data was reloctated to match physical memory
 *
 * @param objectFile
 * @returns an executable file (ELF format)
 */
export function link(objectFile: IELF): IELF {
  const file = createFile()
  mapConstantSymbols(file, objectFile)
  writeSegments(file, objectFile)
  processRelocations(file, objectFile)
  mapSource(file, objectFile)
  clearSections(file)
  return file
}

function mapConstantSymbols(file: IELF, objectFile: IELF) {
  for (const { type, name, value } of getSymbolsOfType(
    objectFile,
    SymbolType.Constant
  )) {
    file.symbols[name] = { type, name, value }
  }
}

function writeSegments(file: IELF, objectFile: IELF): void {
  const writer = new FileWriter(file)
  writeCodeSegment(writer, objectFile)
  writeDataSegment(writer, objectFile)
}

function writeCodeSegment(writer: FileWriter, objectFile: IELF): void {
  writer.startSegment(SegmentType.Load, FLASH_START)
  writer.writeBytes(VECTOR_TABLE)
  for (const section of getSectionsOfType(objectFile, SectionType.Code)) {
    writeSection(writer, objectFile, section)
  }
  writer.writeBytes(END_OF_CODE.toBytes())
  writer.endSegment()
}

function writeDataSegment(writer: FileWriter, objectFile: IELF): void {
  const sections = getSectionsOfType(objectFile, SectionType.Data)
  if (sections.length > 0) {
    writer.startSegment(SegmentType.Load, SRAM_START)
    for (const section of sections) {
      writeSection(writer, objectFile, section)
    }
    writer.endSegment()
  }
}

function writeSection(
  writer: FileWriter,
  objectFile: IELF,
  section: ISection
): void {
  writer.startSection(section.type, section.name)
  const bytes = objectFile.content.slice(
    section.offset,
    section.offset + section.size
  )
  writer.writeBytes(bytes)
  const segment = writer.getCurrentSegment()
  for (const symbol of getSymbolsFromSection(objectFile, section.name)) {
    const offset =
      writer.getCurrentSection().offset + symbol.value.value - segment.offset
    writer.addSymbol({
      type: symbol.type,
      name: symbol.name,
      section: symbol.section,
      value: getAddressInSegment(segment, offset)
    })
  }
  writer.endSection()
}

function processRelocations(file: IELF, objectFile: IELF): void {
  for (const relocation of objectFile.relocations) {
    if (relocation.type === RelocationType.Code) {
      const instruction = relocation.instruction!
      const section = getSection(file, relocation.section)
      const encoder = InstructionSet.getEncoder(
        instruction.name,
        instruction.options
      )
      const address = getAddressInFile(file, section.offset + relocation.offset)
      const vpc = address.add(relocation.length)
      const labels = getLabelOffsets(file, vpc)
      const opcode = encoder.encodeInstruction(instruction.options, labels)
      const offset = section.offset + relocation.offset
      const bytes = opcode.flatMap((x) => x.toBytes())
      setBytes(file, offset, bytes)
    } else if (relocation.type === RelocationType.Data) {
      if (relocation.symbol! in file.symbols) {
        const symbol = file.symbols[relocation.symbol!]
        const section = getSection(file, relocation.section)
        const offset = section.offset + relocation.offset
        setBytes(file, offset, symbol.value.toBytes())
      } else {
        throw new Error(`Symbol '${relocation.symbol!}' is not defined.`)
      }
    }
  }
}

function mapSource(file: IELF, objectFile: IELF): void {
  for (const mapping of objectFile.sourceMap.getMappings()) {
    const section = getSection(file, mapping.section)
    const address = getAddressInFile(file, section.offset + mapping.offset)
    file.sourceMap.mapAddress(address, mapping.line)
  }
}

function clearSections(file: IELF): void {
  file.sections = []
  file.symbols = {}
}
