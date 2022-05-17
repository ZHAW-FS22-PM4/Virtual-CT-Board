import { AreaType, IArea, ICodeFile, IInstruction } from 'assembler/ast'
import { ParseError } from './error'
import { ITextMatch, ITextParseRule, parseText } from './text'

const SYMBOL = `[a-z_]+[a-z0-9_]*|\\|[a-z0-9._ ]+\\|`
const VALUE = `[0-9a-z#]+`
const SPACE_OR_TAB = `[ \\t]`
const STRING = `(?:"(?:[^'"\n]|'"?)*")`

const OPTION = `(?:(?:[0-9a-z#=_]|[\\[{]${SPACE_OR_TAB}*|${SPACE_OR_TAB}*[\\]}]|${SPACE_OR_TAB}*-${SPACE_OR_TAB}*)+|${STRING})`
const INSTRUCTION = `([a-z]+)${SPACE_OR_TAB}+(${OPTION}(${SPACE_OR_TAB}*,${SPACE_OR_TAB}*${OPTION})*)`
const COMMENT = `;[^\\n]*`

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
      name: 'ProcedureInstructionStart',
      pattern: `(${SYMBOL})${SPACE_OR_TAB}+PROC`
    },
    {
      name: 'ProcedureInstructionEnds',
      pattern: `ENDP\|END`
    },
    {
      name: 'ExportInstruction',
      pattern: `EXPORT${SPACE_OR_TAB}+${SYMBOL}`
    },
    {
      name: 'Preserve8Instruction',
      pattern: `THUMB`
    },
    {
      name: 'ThumbInstruction',
      pattern: `PRESERVE8`
    },
    {
      name: 'Comment',
      pattern: COMMENT
    },
    {
      name: 'LiteralSymbolDeclaration',
      pattern: `(${SYMBOL})${SPACE_OR_TAB}+EQU${SPACE_OR_TAB}+(${VALUE})`,
      onMatch(match: ITextMatch) {
        ast.symbols[match.captures[0]] = match.captures[1]
        label = null
      }
    },
    {
      name: 'AreaDeclaration',
      pattern: `AREA${SPACE_OR_TAB}+(${SYMBOL})${SPACE_OR_TAB}*,${SPACE_OR_TAB}*(DATA|CODE)${SPACE_OR_TAB}*,${SPACE_OR_TAB}*(READ(WRITE|ONLY))`,
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
      pattern: `(${SYMBOL})(?=(?:${COMMENT}|\\s)*${SPACE_OR_TAB}${INSTRUCTION})`,
      onMatch(match: ITextMatch) {
        if (!area) {
          throw new ParseError('Label must be defined in area', match.from)
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
            'Instruction must be defined in area',
            match.from
          )
        }
        const instruction: IInstruction = {
          name: match.captures[0].toUpperCase(),
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
    throw new ParseError('Unknown token', cursor)
  }
  return ast
}
