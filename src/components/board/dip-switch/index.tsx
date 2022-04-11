import Board from 'board'
import React from 'react'
import './style.css'

type DipSwitchState = {
  [key: number]: boolean
}

type DipSwitchProps = {
  startIndex: number
  size: number
}

export class DipSwitch extends React.Component<DipSwitchProps, DipSwitchState> {
  private readonly endIndex: number

  constructor(props: DipSwitchProps) {
    super(props)
    this.endIndex = this.props.startIndex + this.props.size - 1
    this.state = this.getState()
  }

  private getState() {
    const state: DipSwitchState = {}

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
      <div className="dip-switch-container">
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
