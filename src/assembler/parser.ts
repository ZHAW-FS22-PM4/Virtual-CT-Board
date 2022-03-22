import { ICode, IArea, AreaType, IInstruction } from './ast'

const START_COMMENT: string = ';'
const START_AREA: string = 'AREA'
const END_AREA: string = 'ALIGN'

//Regexes needed to check syntax
const AREA_TITLE_REGEX: RegExp = / *([a-zA-Z]+) *, *(DATA|CODE) *, *(READ(WRITE|ONLY)) */ //groups 1 and 3 used below
const INSTRUCTION_REGEX: RegExp = /^( |\t)*(([a-z0-9_]+)( |\t)+)*(?!SPACE|EQU|DCD)([A-Z]+)( |\t)+.*$/ //groups 3 ([a-z0-9_]+) and 5 ([A-Z]+) are being used below
const DATA_REGEX: RegExp = /.*(EQU|SPACE|DCD).*/

/**
 * Parses a given code string and returns a code object containing areas that contain instructions.
 * @param code as a string
 * @returns code object
 */
export function parse (code: string): ICode {
  let areaStrings: string[] = code.split(START_AREA)

  if (areaStrings.length == 1) {
    throw new Error('Compile Error.')
  }

  let preface = extractPreface(areaStrings[0])
  areaStrings.splice(0, 1)

  let areas: IArea[] = []

  for (let area of areaStrings) {
    let lines: string[] = area.split('\n')
    lines = removeNonCode(lines)
    if (lines.length == 1 || !area.endsWith(END_AREA))
      throw new Error('Compile Error.') //TODO except last one - should end with 'END'

    //extract params for Area
    let tags = lines[0].match(AREA_TITLE_REGEX)
    if (tags === null || tags.length < 4) throw new Error('Compile Error.')

    let areatype: AreaType = AreaType[tags[2] as keyof typeof AreaType]
    let name: string = tags[1]
    let isReadOnly: boolean = tags[3] === 'READONLY'

    //remove AREA start and end lines
    lines.splice(0, 1)
    lines.splice(-1, 1)

    let instructions: IInstruction[] = []
    lines.forEach((line) => {
      let instruction: IInstruction = createInstruction(line)
      instructions.push(instruction)
    })

    areas.push({
      type: areatype,
      name: name,
      isReadOnly: isReadOnly,
      instructions: instructions
    })
  }

  return { constants: preface, areas: areas }
}

/**
  Deletes line comments and empty lines.
  @param code 
 * @returns 
*/
export function removeNonCode (code: string[]): string[] {
  let lines: string[] = code.filter(
    (line) => line.trim().length > 0 && !line.startsWith(';')
  )
  for (let i = 0; i < lines.length; i++) {
    let index: number = lines[i].indexOf(START_COMMENT)
    if (index != -1) {
      lines[i] = lines[i].slice(0, index)
    }
  }
  return lines
}

/**
 * Checks lines for valid instruction syntax and creates an IInstruction array out of it.
 * @param line instruction line
 * @returns array of instructions
 */
export function createInstruction (line: string): IInstruction {
  line = line.trim()

  let tags = line.match(INSTRUCTION_REGEX)
  if (tags) {
    line = line.slice(line.indexOf(tags[5]) + tags[5].length)
    if (tags[3])
      return {
        name: tags[5],
        label: tags[3],
        params: line.split(',').map((el) => el.trim())
      }
    else
      return {
        name: tags[5],
        label: '',
        params: line.split(',').map((el) => el.trim())
      }
  }
  //TODO handle data instructions
  else {
    throw new Error('Compile Error.')
  }
}

/**
 * Extracts a 2-dimensional string from a code if param is not empty, empty string otherwise.
 * @param unformattedCode code that stands before first occurrence of START_AREA.
 * @returns extracted preface.
 */
export function extractPreface (unformattedCode: string): any {
  return unformattedCode === ''
    ? ''
    : unformattedCode.split('\n').map((line) => line.split(' '))
}
