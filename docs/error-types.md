# Errors

* `Error`: Used for all runtime exceptions or system exceptions. These are exceptions that should never occur because they most likely result due to a bug and are in the control of the software. For example are all exceptions on the binary types of type `Error` because it is the programmers task to pass the appropriate parameters that do not cause exceptions.

## Business Exceptions:

Business exceptions are thrown in case of a external factors which the software cannot control itself. The classical example would be user generated content like for example passing the wrong register count to the encoder function on the instruction.

* `InstructionError`: Everything related to instructions. When thrown inside instructions the line with the instruction will be highlighted in the text editor.
* `AssemblerError`: Everything related to the assembler. Contains a line number on which the exception occurred. Is used by the editor to highlight the correct line with the instruction that caused the exception.
  * `ParserError`: Special implementation of the `AssemblerError` that contains the `ITextCursor`