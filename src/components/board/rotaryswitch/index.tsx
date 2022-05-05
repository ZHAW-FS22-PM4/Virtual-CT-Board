import Board from 'board'
import React from 'react'
import './style.css'

type RotaryState = {
  [key: number]: number
}

export class RotarySwitchComponent extends React.Component<RotaryState> {
  private rotaryValue: number // only temporary for testing.
  private mouseClicked: boolean

  constructor(props: {}) {
    super(props)
    this.state = this.getState()
    this.rotaryValue = 0
    this.mouseClicked = false
  }

  private getState() {
    const state: RotaryState = {}
    state[1] =4//Board.rotaryswitch.getRotaryValue()

    //this.rotaryValue = state[1]
    //let serotaryValue = Board.rotaryswitch.getRotaryValue()
    return state
  }

  private handleRotarySwitch = (key: number, e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (this.mouseClicked) {
      if (e.movementX > 0) {
        Board.rotaryswitch.increase()
        this.rotaryValue = this.rotaryValue + 1;
      } else {
        Board.rotaryswitch.decrease()
        this.rotaryValue = this.rotaryValue - 1;
      }
    }
    this.setState(this.getState())
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
        {Object.keys(this.state).map(Number)
          .map((key) => (
            <div key={'rotaryswitch'}>
              <button
                  className={`rotaryswitch-button ${
                this.mouseClicked ? 'rotaryswitch-button-clicked' : 'rotaryswitch-button-notclicked'}`}
              />
              <div className="rotary-text">{this.rotaryValue}</div>
              <canvas
                  className={`rotaryswitch-canvas`}
                  onMouseOut={() => this.mouseUp()}
                  onMouseDown={() => this.mouseDown()}
                  onMouseUp={() => this.mouseUp()}
                  onMouseMove={(e) => this.handleRotarySwitch(key, e)}
              />
            </div>
          ))}
      </div>
    )
  }

}
