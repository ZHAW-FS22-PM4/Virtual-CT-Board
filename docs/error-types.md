# Errors

* `Error`: Used for all runetime exceptions or system exceptions. These are exceptions that should never occur because they most likely result due to a bug. For example are all exceptions on the binary types of type `Error` because it is the users task to pass the appropriate parameters that do not cause exceptions.

## Business Exceptions:

Business exceptions are thrown in case of a external factor which the software cannot control itself. The classical example would be user generated content like for example passing the wrong register count to the encoder function on the instruction.

* `InstructionError`: Everything related to instructions.
* `AssemblerError`: Everything related to the assembler. Contains a line number on which the exception occurred.
  * `ParserError`: Special implementation of the AssemblerError that contains the `ITextCursor` 