import Board from 'board'
import classNames from 'classnames'
import React from 'react'
import './style.css'

export type ButtonProps = {
  startIndex: number
  size: number
}

type ButtonState = {
  [key: number]: boolean
}

export class ButtonComponent extends React.Component<ButtonProps, ButtonState> {
  private readonly endIndex: number

  constructor(props: ButtonProps) {
    super(props)
    this.endIndex = this.props.startIndex + this.props.size - 1
    this.state = this.getState()
    Board.buttons.on('change', () => this.setState(this.getState()))
  }

  public toggleButton(position: number): void {
    this.state[position]
      ? Board.buttons.release(position)
      : Board.buttons.press(position)
  }

  private getState() {
    const state: ButtonState = {}
    for (let i = this.props.startIndex; i <= this.endIndex; i++) {
      state[i] = Board.buttons.isPressed(i)
    }
    return state
  }

  public render(): React.ReactNode {
    return (
      <div className="button-component">
        {Object.keys(this.state)
          .map(Number)
          .sort((n1, n2) => n2 - n1)
          .map((position) => (
            <div className="button-wrapper" key={'button_' + position}>
              <div className="button-socket">
                <div
                  className={classNames('button', {
                    down: this.state[position]
                  })}
                  onClick={() => this.toggleButton(position)}
                />
              </div>
              <div className="label">{'T' + position}</div>
            </div>
          ))}
      </div>
    )
  }
}
