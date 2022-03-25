export enum VirtualBoardErrorType {
  NoEncoderFound,
  InvalidAreaType,
  InvalidParamProvided,
  BitOutOfTypeRange
}

export class VirtualBoardError extends Error {
  type: VirtualBoardErrorType

  constructor(msg: string, type: VirtualBoardErrorType) {
    super(msg)
    this.type = type
  }
}
