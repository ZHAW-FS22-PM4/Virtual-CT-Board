import { AssemblerError } from 'assembler/error'
import { ITextCursor } from './text'

export class ParseError extends AssemblerError {
  public cursor: ITextCursor
  constructor(message: string, cursor: ITextCursor) {
    super(message, cursor.line, cursor.position)
    this.cursor = cursor
  }
}
