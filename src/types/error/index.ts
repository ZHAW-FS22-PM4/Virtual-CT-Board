export enum VirtualBoardErrorType {
  NoEncoderFound,
  InvalidAreaType,
  InvalidParamProvided,
  BitOutOfTypeRange,
  InstructionWrongOptionCount,
  InvalidRegisterAsOption,
  ProvidedRegisterShouldBeLow,
  ProvidedImmediateIsInvalid
}

export class VirtualBoardError extends Error {
  type: VirtualBoardErrorType

  constructor(msg: string, type: VirtualBoardErrorType) {
    super(msg)
    this.type = type
  }
}
