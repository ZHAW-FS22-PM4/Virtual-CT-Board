import { Word } from 'types/binary'
import { IMemory } from 'board/memory/interfaces'

export interface IDevice extends IMemory {
  isResponsibleFor: (address: Word) => boolean
}
