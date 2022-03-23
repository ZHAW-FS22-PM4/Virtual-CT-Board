export enum VirtualBoardErrorType {
  NoEncoderFound,
  InvalidAreaType,
  InvalidParamProvided
}

export class VirtualBoardError extends Error {
  type: VirtualBoardErrorType

  constructor(msg: string, type: VirtualBoardErrorType) {
    super(msg)
    this.type = type
  }
}
