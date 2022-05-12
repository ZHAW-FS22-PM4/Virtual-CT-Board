/**
 * Error that is thrown for everything outside of the control of the software within the assembler.
 * Contains special attribute with line on which the error occurred.
 */
export class AssemblerError extends Error {
  public line: number
  constructor(message: string, line: number, pos?: number) {
    super(`${message} Line: ${line + 1} ${pos ? 'Position: ' + pos : ''}`)
    this.line = line
  }
}
