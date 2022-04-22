import { ITextCursor } from './text'

export class ParseError extends Error {
  public cursor: ITextCursor
  constructor(cursor: ITextCursor, message: string) {
    super(`${message} at Line ${cursor.line + 1}, Position ${cursor.position}`)
    this.cursor = cursor
  }
}

export class CompileError extends Error {
  public line: number
  constructor(line: number, message: string) {
    super(`${message} at Line ${line}`)
    this.line = line
  }
}

export class EncoderError extends Error {
  constructor(message: string) {
    super(message)
  }
}
