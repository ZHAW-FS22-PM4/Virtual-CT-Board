import React from 'react'


import Board from 'board'


import './style.css'
import { Word } from '../../types/binary'

type memoryState = {
  [key: string]: Word
}

export class MemoryExplorerComponent extends React.Component<{}, any> {
  constructor(props: {}) {
    super(props)
    Board.processor.on('afterCycle', this.afterCycle)
    this.state = this.getState()
  }

  private getState() {
    const state: memoryState = {}
    state['0x20000000'] = Word.fromUnsignedInteger(0x20000000)
    state['0x20000001'] = Word.fromUnsignedInteger(0x20000000)
    state['0x20000002'] = Word.fromUnsignedInteger(0x20000000)
    state['0x20000003'] = Word.fromUnsignedInteger(0x20000000)
    state['0x20000004'] = Word.fromUnsignedInteger(0x20000000)
    state['0x20000005'] = Word.fromUnsignedInteger(0x20000000)
    state['0x20000006'] = Word.fromUnsignedInteger(0x20000000)
    state['0x20000007'] = Word.fromUnsignedInteger(0x20000000)
    state['0x20000008'] = Word.fromUnsignedInteger(0x20000000)
    state['0x20000009'] = Word.fromUnsignedInteger(0x20000000)
    state['0x20000009'] = Word.fromUnsignedInteger(0x20000000)
    state['0x20000009'] = Word.fromUnsignedInteger(0x20000000)
    return state
  }

  private afterCycle() {
    this.setState(this.getState())
  }

  public render(): React.ReactNode {
    return (
      <div className="memory-container">
        <h4 className="title">Memory</h4>
        <div className="memory overflow-auto">
          {Object.keys(this.state).map((key) => (
            <div>
              {key} : {this.state[key].toHexString()}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
