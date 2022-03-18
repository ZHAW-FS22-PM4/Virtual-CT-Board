import { parse } from './parser'
import { encode } from './encoder'
import { IObjectFile } from './objectFile'

export function assemble(code: string): IObjectFile {
  const ast = parse(code)
  return encode(ast)
}
