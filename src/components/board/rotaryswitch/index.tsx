import Board from 'board'
import React from 'react'
import './style.css'

type RotaryState = {
  [key: number]: boolean
}

type RotaryProbs = {
  startIndex: number
  size: number
}

export class RotarySwitch extends React.Component<RotaryProbs, RotaryState> {
  private readonly endIndex: number
  private rotaryValue: number

  constructor(props: RotaryProbs) {
    super(props)
    this.endIndex = this.props.startIndex + this.props.size - 1
    this.state = this.getState()
    this.rotaryValue = 0
  }

  private getState() {
    const state: RotaryState = {}
    for (let i = this.props.startIndex; i <= this.endIndex; i++) {
      state[i] = Board.buttons.isPressed(i)
    }
    return state
  }

  private handleRotarySwitch = (key: number): void => {
    this.rotaryValue = this.rotaryValue + 1;

    this.state[key] ? Board.buttons.release(key) : Board.buttons.press(key)
    this.setState((state) => ({
      [key]: !state[key]
    }))
  }

  public render(): React.ReactNode {
    return (
      <div className="rotaryswitch-container">
        {Object.keys(this.state).map(Number)
          .map((key) => (
            <div key={'rotaryswitch'}>
              <div className="rotary-display">{"Rotary Value: " + this.rotaryValue}</div>
              <button
                className={`rotaryswitch-button`}
                onClick={() => this.handleRotarySwitch(key)}
              />
            </div>
          ))}
      </div>
    )
  }

}
