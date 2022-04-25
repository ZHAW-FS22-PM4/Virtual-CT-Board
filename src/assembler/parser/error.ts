import { ITextCursor } from './text'

export class ParseError extends Error {
  public cursor: ITextCursor
  constructor(cursor: ITextCursor, message: string) {
    super(`${message} at Line ${cursor.line + 1}, Position ${cursor.position}`)
    this.cursor = cursor
  }
}