import { addInstruction } from './registry'

import { MovInstruction } from './mov'

addInstruction(new MovInstruction())

export { ILabelOffsets, IInstructionEncoder, IInstructionExecutor } from './interfaces'
export { getEncoder, getExecutor } from './registry'