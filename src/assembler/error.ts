/**
 * Error that is thrown for everything outside of the control of the software within the assembler.
 * Contains special attribute with line on which the error occurred.
 */
export class AssemblerError extends Error {
  public line: number
  constructor(message: string, line: number, pos?: number) {
    super(`${message} at Line: ${line} ${pos ? ', Position: ' + pos : ''}`)
    this.line = line
  }
}
