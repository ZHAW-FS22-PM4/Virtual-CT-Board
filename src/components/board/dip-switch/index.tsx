import React from 'react'

import './style.css'
import Board from '../../../board'

type DipSwitchState = {
  [key: string]: boolean
}

export class DipSwitch extends React.Component<{}, DipSwitchState> {
  constructor(props: {}) {
    super(props)
    Board.processor.on('afterCycle', this.afterCycle)
    this.state = this.getState()
  }

  private afterCycle() {
    this.setState(this.getState())
  }

  private getState() {
    const state: DipSwitchState = {}
    // TODO: replace switch placeholders
    state['S1'] = true
    state['S2'] = true
    state['S3'] = false
    state['S4'] = false
    state['S5'] = true
    state['S6'] = true
    state['S7'] = false
    state['S8'] = true
    return state
  }

  public render(): React.ReactNode {
    return (
      <div className="dip-switch-container">
        {Object.keys(this.state).map((key) => (
          <div>
            <div>{key}</div>
            <button>{this.state[key]}</button>
          </div>
        ))}
      </div>
    )
  }
}
