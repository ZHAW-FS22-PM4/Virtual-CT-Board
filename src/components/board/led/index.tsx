import React from 'react'
import Board from '../../../board'

import './style.css'

type LedState = {
  [key: number]: boolean
}

type LedProps = {
  startIndex: number
  size: number
}

export class Led extends React.Component<LedProps, LedState> {
  private readonly endIndex: number

  constructor(props: LedProps) {
    super(props)
    this.endIndex = this.props.startIndex + this.props.size - 1
    this.state = this.getState()
  }

  private getState() {
    const state: LedState = {}

    for (let i = this.props.startIndex; i <= this.endIndex; i++) {
      state[i] = Board.switches.isOn(i)
    }

    return state
  }

  private handleSwitch = (key: number): void => {
    this.setState((state) => ({
      [key]: !state[key]
    }))
    Board.switches.toggle(key)
  }

  public render(): React.ReactNode {
    return (
      <div className="dip-led-container">
        {Object.keys(this.state)
          .map(Number)
          .sort((n1, n2) => n2 - n1)
          .map((key) => (
            <div key={'switch-' + key}>
              <div className="label">{'S' + key}</div>
              <button
                className={`switch ${
                  this.state[key] ? 'switch-on' : 'switch-off'
                }`}
                onClick={() => this.handleSwitch(key)}
              />
            </div>
          ))}
      </div>
    )
  }
}
