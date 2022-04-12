import React from 'react'
import Board from 'board'

import './style.css'

type ButtonState = {
  [key: number]: boolean
}

type ButtonProps = {
  startIndex: number
  size: number
}

export class Button extends React.Component<ButtonProps, ButtonState> {
  private readonly endIndex: number

  constructor(props: ButtonProps) {
    super(props)
    this.endIndex = this.props.startIndex + this.props.size - 1
    this.state = this.getState()
  }

  private getState() {
    const state: ButtonState = {}
    for (let i = this.props.startIndex; i <= this.endIndex; i++) {
      state[i] = Board.buttons.isPressed(i)
    }
    return state
  }

  private handleButton = (key: number): void => {
    this.setState((state) => ({
      [key]: !state[key]
    }))
    if (this.state[key]) {
      Board.buttons.press(key)
    } else {
      Board.buttons.release(key)
    }
  }

  public render(): React.ReactNode {
    return (
      <div className="button-container">
        {Object.keys(this.state)
          .map(Number)
          .sort((n1, n2) => n2 - n1)
          .map((key) => (
            <div key={'button-' + key}>
              <div className="label">{'T' + key}</div>
              <button
                className={`button ${
                  this.state[key] ? 'button-on' : 'button-off'
                }`}
                onClick={() => this.handleButton(key)}
              />
            </div>
          ))}
      </div>
    )
  }
}
