import { IObjectFile } from './objectFile'
import { parse } from './parser'
import { encode } from './encoder'

/**
 * Assembles a code file (text representation) into an object file.
 *
 * @param code the assembler code
 * @returns the generated object file
 */
export function assemble(code: string): IObjectFile {
  const ast = parse(code)
  return encode(ast)
}
