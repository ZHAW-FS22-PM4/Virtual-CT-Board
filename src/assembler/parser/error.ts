import { VirtualBoardError, VirtualBoardErrorType } from 'types/error'
import { ITextCursor } from './text'

export class ParseError extends Error {
  public cursor: ITextCursor
  constructor(cursor: ITextCursor, message: string) {
    super(`${message} at Line ${cursor.line + 1}, Position ${cursor.position}`)
    this.cursor = cursor
  }
}

export class CompileError extends VirtualBoardError {
  public line: number
  constructor(line: number, message: string, type: VirtualBoardErrorType) {
    super(`${message} at Line ${line + 1}`, type)
    this.line = line
  }
}
