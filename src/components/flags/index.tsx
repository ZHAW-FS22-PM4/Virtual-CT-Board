import Board from 'board'
import { Flag } from 'board/registers'
import React from 'react'
import { $enum } from 'ts-enum-util'
import './style.css'

type FlagState = {
  [key: string]: string
}

export class FlagsComponent extends React.Component<{}, FlagState> {
  constructor(props: {}) {
    super(props)
    Board.processor.on('afterReset', () => this.update())
    Board.processor.on('afterCycle', () => this.update())
    this.state = this.getState()
  }

  private update() {
    this.setState(this.getState())
  }

  private getState() {
    const state: FlagState = {}
    for (const flag of $enum(Flag).getValues()) {
      const name = Flag[flag]
      state[name] = Board.registers.isFlagSet(flag) ? '1' : '0'
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
