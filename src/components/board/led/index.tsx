import Board from 'board'
import React from 'react'
import './style.css'

type LedState = {
  [key: number]: boolean
}

type LedProps = {
  startIndex: number
  size: number
}

export class LedComponent extends React.Component<LedProps, LedState> {
  private readonly endIndex: number

  constructor(props: LedProps) {
    super(props)
    this.endIndex = this.props.startIndex + this.props.size - 1
    Board.processor.on('afterCycle', () => this.update())
    this.state = this.getState()
  }

  private update() {
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
      <div className="led-container">
        <div className="led-label" style={{ fontSize: 10 }}>
          <div className="led-label-left">
            LED{this.props.startIndex + 7}...{this.props.startIndex + 4}
          </div>
          <div className="led-label-right" style={{ textAlign: 'right' }}>
            LED{this.props.startIndex + 3}...{this.props.startIndex}
          </div>
        </div>
        <div className="led-display">
          {Object.keys(this.state)
            .map(Number)
            .sort((n1, n2) => n2 - n1)
            .map((key) => (
              <div className="led" key={'led-' + key}>
                <div
                  className={`led ${this.state[key] ? 'led-on' : 'led-off'}`}
                />
              </div>
            ))}
        </div>
      </div>
    )
  }
}
