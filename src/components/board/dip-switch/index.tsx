import Board from 'board'
import classNames from 'classnames'
import React from 'react'
import './style.css'

export type DipSwitchProps = {
  startIndex: number
  size: number
}

type DipSwitchState = {
  [key: number]: boolean
}

export class DipSwitchComponent extends React.Component<
  DipSwitchProps,
  DipSwitchState
> {
  private readonly endIndex: number

  constructor(props: DipSwitchProps) {
    super(props)
    this.endIndex = this.props.startIndex + this.props.size - 1
    this.state = this.getState()
  }

  public toggleSwitch(position: number): void {
    this.setState({
      [position]: !this.state[position]
    })
    Board.switches.toggle(position)
  }

  private getState() {
    const state: DipSwitchState = {}
    for (let i = this.props.startIndex; i <= this.endIndex; i++) {
      state[i] = Board.switches.isOn(i)
    }
    return state
  }

  public render(): React.ReactNode {
    return (
      <div className="dip-switch-component">
        {Object.keys(this.state)
          .map(Number)
          .sort((n1, n2) => n2 - n1)
          .map((position) => (
            <div className="dip-switch" key={'dip_switch_' + position}>
              <div
                className={classNames('switch', {
                  on: this.state[position],
                  off: !this.state[position]
                })}
                onClick={() => this.toggleSwitch(position)}
              />
              <div className="label">{'S' + position}</div>
            </div>
          ))}
      </div>
    )
  }
}
