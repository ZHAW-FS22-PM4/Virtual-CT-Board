import Board from 'board'
import classNames from 'classnames'
import React from 'react'
import './style.css'

export type LedProps = {
  startIndex: number
  size: number
}

type LedState = {
  [key: number]: boolean
}

export class LedComponent extends React.Component<LedProps, LedState> {
  private readonly endIndex: number

  constructor(props: LedProps) {
    super(props)
    this.endIndex = this.props.startIndex + this.props.size - 1
    this.state = this.getState()
    Board.leds.on('change', () => this.update())
  }

  public update() {
    return this.setState(this.getState())
  }

  private getState() {
    const state: LedState = {}
    for (let i = this.props.startIndex; i <= this.endIndex; i++) {
      state[i] = Board.leds.isOn(i)
    }
    return state
  }

  public render(): React.ReactNode {
    return (
      <div className="led-component">
        <div className="leds bg-light">
          {Object.keys(this.state)
            .map(Number)
            .sort((n1, n2) => n2 - n1)
            .map((key) => (
              <div
                className={classNames('led', {
                  on: this.state[key]
                })}
                key={'led_' + key}
              />
            ))}
        </div>
        <div className="label">
          <span>
            LED{this.props.startIndex + 7}..{this.props.startIndex + 4}
          </span>
          <span>
            LED{this.props.startIndex + 3}..{this.props.startIndex}
          </span>
        </div>
      </div>
    )
  }
}
