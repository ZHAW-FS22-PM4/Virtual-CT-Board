import { AssemblerError } from 'assembler/error'
import { InstructionError } from 'instruction/error'
import InstructionSet from 'instruction/set'
import { END_OF_CODE } from 'instruction/special'
import { Word } from 'types/binary'
import {
  IELF,
  IRelocation,
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
  addConstantSymbols(file, objectFile)
  writeSegments(file, objectFile)
  applyRelocations(file, objectFile)
  mapSource(file, objectFile)
  clearSections(file)
  return file
}

/**
 * Adds the constant symbols from the object file to the file
 *
 * @param file the file
 * @param objectFile the object file
 */
function addConstantSymbols(file: IELF, objectFile: IELF): void {
  for (const { type, name, value } of getSymbolsOfType(
    objectFile,
    SymbolType.Constant
  )) {
    file.symbols[name] = { type, name, value }
  }
}

/**
 * Writes the segments to the file by using the sections from the
 * specified object file.
 *
 * @param file the file
 * @param objectFile the object file
 */
function writeSegments(file: IELF, objectFile: IELF): void {
  const writer = new FileWriter(file)
  writeCodeSegment(writer, objectFile)
  writeDataSegment(writer, objectFile)
}

/**
 * Writes all code sections from the object file to
 * the file writer.
 *
 * @param writer the file writer
 * @param objectFile the object file
 */
function writeCodeSegment(writer: FileWriter, objectFile: IELF): void {
  writer.startSegment(SegmentType.Load, FLASH_START)
  writer.writeBytes(VECTOR_TABLE)
  const sections = getSectionsOfType(objectFile, SectionType.Code)
  if (sections.length > 0) {
    for (const section of sections) {
      writeSection(writer, objectFile, section)
      writer.writeBytes(END_OF_CODE.toBytes())
      writer.align(4)
    }
  } else {
    writer.startSection(SectionType.Code, '|.empty|')
    writer.writeBytes(END_OF_CODE.toBytes())
    writer.align(4)
    writer.endSection()
  }
  writer.endSegment()
}

/**
 * Writes all data sections from the object file to
 * the file writer.
 *
 * @param writer the file writer
 * @param objectFile the object file
 */
function writeDataSegment(writer: FileWriter, objectFile: IELF): void {
  const sections = getSectionsOfType(objectFile, SectionType.Data)
  if (sections.length > 0) {
    writer.startSegment(SegmentType.Load, SRAM_START)
    for (const section of sections) {
      writeSection(writer, objectFile, section)
      writer.align(4)
    }
    writer.endSegment()
  }
}

/**
 * Writes a section from an object file to the current segment.
 *
 * @param writer the file writer
 * @param objectFile the object file
 * @param section the section to write
 */
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
  addAddressSymbols(writer, objectFile, section)
  writer.endSection()
}

/**
 * Adds the address symbols of the object file to the file writer.
 *
 * @param writer the file writer
 * @param objectFile the object file
 * @param section the section from which the symbols are added
 */
function addAddressSymbols(
  writer: FileWriter,
  objectFile: IELF,
  section: ISection
) {
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
}

/**
 * Applies all re-locations from an object file so that all the
 * code and data instructions which depend on symbols are updated.
 *
 * @param file the file
 * @param objectFile the object file
 */
function applyRelocations(file: IELF, objectFile: IELF): void {
  for (const relocation of objectFile.relocations) {
    if (relocation.type === RelocationType.Code) {
      applyCodeRelocation(file, relocation)
    } else if (relocation.type === RelocationType.Data) {
      applyDataRelocation(file, relocation)
    }
  }
}

/**
 * Applies the specified code re-location in the file by re-encoding
 * the affected instruction with the label offsets.
 *
 * @param file the file
 * @param relocation the code re-location
 */
function applyCodeRelocation(file: IELF, relocation: IRelocation) {
  const instruction = relocation.instruction!
  const section = getSection(file, relocation.section)
  const encoder = InstructionSet.getEncoder(
    instruction.name,
    instruction.options
  )
  const address = getAddressInFile(file, section.offset + relocation.offset)
  const vpc = address.add(relocation.length)
  const labels = getLabelOffsets(file, vpc)
  try {
    const opcode = encoder.encodeInstruction(instruction.options, labels)
    const offset = section.offset + relocation.offset
    const bytes = opcode.flatMap((x) => x.toBytes())
    setBytes(file, offset, bytes)
  } catch (e: any) {
    if (e instanceof InstructionError) {
      throw new AssemblerError(e.message, instruction.line)
    } else if (e instanceof Error) {
      throw e // in case of everything else just throw it on
    }
  }
}

/**
 * Applies the specified data re-location in the file by writing
 * the symbol value to the affected location.
 *
 * @param file the file
 * @param relocation the data re-location
 */
function applyDataRelocation(file: IELF, relocation: IRelocation) {
  if (relocation.symbol! in file.symbols) {
    const symbol = file.symbols[relocation.symbol!]
    const section = getSection(file, relocation.section)
    const offset = section.offset + relocation.offset
    setBytes(file, offset, symbol.value.toBytes())
  } else {
    throw new AssemblerError(
      `Symbol '${relocation.symbol!}' is not defined.`,
      relocation.line
    )
  }
}

/**
 * Maps the source mapping from the specified object file into the file.
 *
 * @param file the file
 * @param objectFile the object file
 */
function mapSource(file: IELF, objectFile: IELF): void {
  for (const mapping of objectFile.sourceMap.getMappings()) {
    const section = getSection(file, mapping.section)
    const address = getAddressInFile(file, section.offset + mapping.offset)
    file.sourceMap.mapAddress(address, mapping.line)
  }
}

/**
 * Clears all section informations from the file.
 *
 * @param file the file to be cleared
 */
function clearSections(file: IELF): void {
  file.sections = []
  file.symbols = {}
}
