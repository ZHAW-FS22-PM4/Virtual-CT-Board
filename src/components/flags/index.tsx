import React from 'react'
import { $enum } from 'ts-enum-util'
import Board from 'board'
import { Register, Flag } from 'board/registers'

import './style.css'

type FlagState = {
  [key: string]: string
}

export class FlagsComponent extends React.Component<{}, FlagState> {
  constructor(props: {}) {
    super(props)
    Board.processor.on('afterCycle', this.afterCycle)
    this.state = this.getState()
  }

  private afterCycle() {
    this.setState(this.getState())
  }

  private getState() {
    const state: FlagState = {}
    for (const flag of $enum(Flag).getValues()) {
      const name = Flag[flag]
      state[name] = Board.registers.isFlagSet(flag).toString()
    }
    return state
  }

  render(): React.ReactNode {
    return (
      <div className="status-flags-container">
        <div>
          <div className="row justify-content-md-center">
            {Object.keys(this.state).map((key) => (
              <div key={'flag_' + key} className="col-md-auto">
                {key}
              </div>
            ))}
          </div>
          <div className="row justify-content-md-center">
            {Object.keys(this.state).map((key) => (
              <div key={'flagvalue_' + key} className="col-md-auto">
                {this.state[key]}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
