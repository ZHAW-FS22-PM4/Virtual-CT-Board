import Board from 'board'
import React from 'react'
import './style.css'

type RotaryState = {
  value: string
}

export class RotarySwitchComponent extends React.Component<{}, RotaryState> {
  private mouseClicked: boolean

  constructor(props: {}) {
    super(props)
    this.mouseClicked = false
    this.state = { value: Board.rotaryswitch.getRotaryValue().toHexString() }
    Board.processor.on('afterReset', () => this.update())
  }

  private update() {
    this.setState({ value: Board.rotaryswitch.getRotaryValue().toHexString() })
  }

  private handleRotarySwitch = (
    e: React.MouseEvent<HTMLCanvasElement>
  ): void => {
    if (this.mouseClicked) {
      if (e.movementX > 0) {
        Board.rotaryswitch.increase()
      } else {
        Board.rotaryswitch.decrease()
      }
    }
    this.update()
  }

  private mouseDown = (): void => {
    this.mouseClicked = true
  }

  private mouseUp = (): void => {
    this.mouseClicked = false
  }

  public render(): React.ReactNode {
    return (
      <div className="rotaryswitch-container">
        <div key={'rotaryswitch'}>
          <button
            className={`rotaryswitch-button ${
              this.mouseClicked
                ? 'rotaryswitch-button-clicked'
                : 'rotaryswitch-button-notclicked'
            }`}
          />
          <div className="rotary-text">{this.state.value}</div>
          <canvas
            className={`rotaryswitch-canvas`}
            onMouseOut={() => this.mouseUp()}
            onMouseDown={() => this.mouseDown()}
            onMouseUp={() => this.mouseUp()}
            onMouseMove={(e) => this.handleRotarySwitch(e)}
          />
        </div>
      </div>
    )
  }
}
