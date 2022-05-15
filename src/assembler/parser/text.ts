import { ParseError } from 'assembler/parser/error'

/**
 * Represents a text cursor which points to a specific location in a text.
 */
export interface ITextCursor {
  index: number
  line: number
  position: number
}

/**
 * Represents a text match during parsing.
 */
export interface ITextMatch {
  from: ITextCursor
  to: ITextCursor
  text: string
  captures: string[]
}

/**
 * Represents a rule for parsing text.
 */
export interface ITextParseRule {
  name: string
  pattern: string | RegExp
  onMatch?(match: ITextMatch): void
}

/**
 * Parses text using the specified rules.
 *
 * @param text the text to be parsed
 * @param rules the rules to be used for parsing
 * @returns the last cursor position before there was no more match
 */
export function parseText(text: string, rules: ITextParseRule[]): ITextCursor {
  let startCursor: ITextCursor = { index: 0, line: 0, position: 0 }
  while (startCursor.index < text.length) {
    let noMatch = true
    for (const rule of rules) {
      if (rule.pattern) {
        const expression = new RegExp(rule.pattern, 'ymi')
        expression.lastIndex = startCursor.index
        const match = expression.exec(text)
        if (match) {
          const lineBreaks = (match[0].match(/\n/g) || []).length
          let endCursor = {
            index: expression.lastIndex,
            line: startCursor.line + lineBreaks,
            position:
              lineBreaks > 0
                ? match[0].length - match[0].lastIndexOf('\n') - 1
                : startCursor.position + match[0].length
          }
          if (rule.name == 'Instruction') {
            let charCodeBeforeInstruction = text.charCodeAt(
              startCursor.index - 1
            )
            if (
              charCodeBeforeInstruction !== 32 &&
              charCodeBeforeInstruction !== 9
            ) {
              throw new ParseError(
                'Instruction not indented by space or tab.',
                startCursor
              )
            }
          }
          if (rule.onMatch)
            rule.onMatch({
              from: startCursor,
              to: endCursor,
              text: match[0],
              captures: match.slice(1)
            })
          startCursor = endCursor
          noMatch = false
          break
        }
      }
    }
    if (noMatch) {
      break
    }
  }
  return startCursor
}
