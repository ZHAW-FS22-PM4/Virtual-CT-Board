import { AssemblerError } from 'assembler/error'
import { ITextCursor } from './text'

export class ParseError extends AssemblerError {
  public cursor: ITextCursor
  constructor(message: string, cursor: ITextCursor) {
    super(message, cursor.line + 1, cursor.position)
    this.cursor = cursor
  }
}
