import { IMemory } from 'board/memory/interfaces'
import { Word } from 'types/binary'

export interface IDevice extends IMemory {
  isResponsibleFor: (address: Word) => boolean
}
