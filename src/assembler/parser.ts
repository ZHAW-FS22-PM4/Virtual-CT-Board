import { ICode, IArea, AreaType, IInstruction, getAreaType } from './ast'

const START_COMMENT: string = ';'
const START_AREA: string = 'AREA'
const END_AREA: string = 'ALIGN'

//Regexes needed to check syntax
const AREA_TITLE_REGEX: RegExp = / *([a-zA-Z]+) *, *(DATA|CODE) *, *READ(WRITE|ONLY) */
const INSTRUCTION_REGEX: RegExp = /^( |\t)*(([a-z0-9_]+)( |\t)+)*(?!SPACE|EQU|DCD)([A-Z]+)( |\t)+.*$/ //groups 3 ([a-z0-9_]+) and 5 ([A-Z]+) are being used below
const DATA_REGEX: RegExp = /.*(EQU|SPACE|DCD).*/

/**
 * Parses a given code string and returns a code object containing areas that contain instructions.
 * @param code as a string
 * @returns code object
 */
export function parse (code: string): ICode {
  let areaStrings: string[] = code.split(START_AREA)

  if (!areaStrings) {
    throw new Error('Compile Error.')
  }

  let preface: string[][] = areaStrings[0].split('\n').map(line => line.split(' '))
  delete areaStrings[0]

  let areas: IArea[] = []

  for (let area of areaStrings) {
    let lines: string[] = area.split('\n')
    lines = removeNonCode(lines)
    if (!area.endsWith(END_AREA)) throw new Error('Compile Error.') //TODO except last one

    //extract params for Area
    let tags = lines[0].match(AREA_TITLE_REGEX)
    if (tags === null || tags.length < 4) throw new Error('Compile Error.')

    let areatype: AreaType = getAreaType(tags[2])
    let name: string = tags[1]
    let isReadOnly: boolean = tags[3] === "READONLY"

    let instructions: IInstruction[] = []
    lines.forEach(line => {
      let instruction: IInstruction = createInstruction(line)
      instructions.push(instruction)
    })

    areas.push({type: areatype, name: name, isReadOnly: isReadOnly, instructions: instructions})
  }

  return {constants: preface, areas: areas}
}

/**
  Deletes line comments and empty lines.
  @param code 
 * @returns 
*/
export function removeNonCode(code: string[]): string[] {
  let lines: string[] = code.filter(line => (line.trim().length > 0) && !line.startsWith(";"))
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
export function createInstruction(line: string): IInstruction {
  line = line.trim()

  let tags = line.match(INSTRUCTION_REGEX)
  if (tags) {
    line = line.slice(line.indexOf(tags[5])+tags[5].length)
    if (tags[3]) return {name: tags[5], label: tags[3], params: line.split(',').map(el => el.trim())}
    else return {name: tags[5], label: "", params: line.split(',').map(el => el.trim())}
  }

  /*else {
    let tags = line.match(INSTRUCTION_REGEX)
    if (tags) {
      line = line.slice(line.indexOf(tags[2])+tags[2].length)
      return {name: tags[2], label: '', params: line.split(',').map(el => el.trim())}
    }
      //TODO handle data instructions*/
    else {
      throw new Error('Compile Error.')
    }
  //}

}



