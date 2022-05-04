import { IELF } from './elf/interfaces'
import { encode } from './encoder'
import { link } from './linker'
import { parse } from './parser'

/**
 * Assembles a code file (text representation) into an executable file (ELF format).
 *
 * @param code the assembler code
 * @returns the assembled executable file
 */
export function assemble(code: string): IELF {
  const ast = parse(code)
  const objectFile = encode(ast)
  return link(objectFile)
}
