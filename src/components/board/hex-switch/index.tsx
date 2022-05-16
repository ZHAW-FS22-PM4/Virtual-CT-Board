import Board from 'board'
import classNames from 'classnames'
import React from 'react'
import './style.css'

interface IHexSwitchState {
  moving: boolean
  value: string
}

export class HexSwitchComponent extends React.Component<{}, IHexSwitchState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      moving: false,
      value: Board.hexSwitch.getHexValue().toString(16)
    }
    Board.hexSwitch.on('change', () => this.update())
  }

  public update() {
    this.setState({ value: Board.hexSwitch.getHexValue().toString(16) })
  }

  private mouseDown(): void {
    this.setState({ moving: true })
  }

  private mouseMove(e: React.MouseEvent<HTMLDivElement>): void {
    if (this.state.moving) {
      if (e.movementX > 0) {
        Board.hexSwitch.increase()
      } else {
        Board.hexSwitch.decrease()
      }
    }
    this.update()
  }

  private mouseUp(): void {
    this.setState({ moving: false })
  }

  public render(): React.ReactNode {
    return (
      <div className="hex-switch-component">
        <div
          className={classNames('hex-switch', {
            moving: this.state.moving
          })}>
          {this.state.value}
        </div>
        <div className="overlay-container">
          <div
            className={`overlay`}
            onMouseDown={() => this.mouseDown()}
            onMouseMove={(e) => this.mouseMove(e)}
            onMouseUp={() => this.mouseUp()}
            onMouseOut={() => this.mouseUp()}
          />
        </div>
      </div>
    )
  }
}
