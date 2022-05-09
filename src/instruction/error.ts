/**
 * Error that is thrown for everything outside of the control of the software within instructions.
 */
export class InstructionError extends Error {
  constructor(message: string) {
    super(message)
  }
}
