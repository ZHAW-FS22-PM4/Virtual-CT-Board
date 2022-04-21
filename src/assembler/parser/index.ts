import { AreaType, IArea, ICodeFile, IInstruction } from 'assembler/ast'
import { ParseError } from './error'
import { ITextMatch, ITextParseRule, parseText } from './text'

const SYMBOL = `[a-z_]+[a-z0-9_]*|\\|[a-z0-9._ ]+\\|`
const VALUE = `[0-9a-z#]+`

const OPTION = `[0-9a-z#\\[\\]]+`
const INSTRUCTION = `([a-z]+) +(${OPTION}( *, *${OPTION})*)`

/**
 * Parses a given code string and return a parsed code file (AST representation).
 *
 * @param code the assembler code (text representation)
 * @returns the parsed code file (AST representation)
 */
export function parse(code: string): ICodeFile {
  const ast: ICodeFile = {
    symbols: {},
    areas: []
  }
  let area: IArea | null = null
  let label: string | null = null
  const rules: ITextParseRule[] = [
    {
      name: 'Whitespace',
      pattern: /\s+/
    },
    {
      name: 'Comment',
      pattern: /;[^\n]*/
    },
    {
      name: 'LiteralSymbolDeclaration',
      pattern: `(${SYMBOL}) +EQU +(${VALUE})`,
      onMatch(match: ITextMatch) {
        ast.symbols[match.captures[0]] = match.captures[1]
        label = null
      }
    },
    {
      name: 'AreaDeclaration',
      pattern: `AREA +(${SYMBOL}) *, *(DATA|CODE) *, *(READ(WRITE|ONLY))`,
      onMatch(match: ITextMatch) {
        area = {
          name: match.captures[0],
          type:
            match.captures[1].toUpperCase() === 'CODE'
              ? AreaType.Code
              : AreaType.Data,
          isReadOnly: match.captures[2].toUpperCase() === 'READONLY',
          instructions: []
        }
        ast.areas.push(area)
        label = null
      }
    },
    {
      name: 'Label',
      pattern: `(${SYMBOL})(?=\s+${INSTRUCTION})`,
      onMatch(match: ITextMatch) {
        if (!area) {
          throw new ParseError(match.from, 'Label must be defined in area')
        }
        label = match.captures[0]
      }
    },
    {
      name: 'Instruction',
      pattern: INSTRUCTION,
      onMatch(match: ITextMatch) {
        if (!area) {
          throw new ParseError(
            match.from,
            'Instruction must be defined in area'
          )
        }
        const instruction: IInstruction = {
          name: match.captures[0],
          options: match.captures[1].split(',').map((x) => x.trim()),
          line: match.from.line
        }
        if (label) {
          instruction.label = label
          label = null
        }
        area.instructions.push(instruction)
      }
    }
  ]
  const cursor = parseText(code, rules)
  if (cursor.index != code.length) {
    throw new ParseError(cursor, 'Unknown token')
  }
  return ast
}
