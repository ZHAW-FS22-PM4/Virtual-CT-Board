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
  private rotaryValue: number // only temporary for testing.
  private mouseClicked: boolean
  private serotaryValue: number

  constructor(props: RotaryProbs) {
    super(props)
    this.endIndex = this.props.startIndex + this.props.size - 1
    this.state = this.getState()
    this.rotaryValue = 0
    this.serotaryValue = 0
    this.mouseClicked = false
  }

  private getState() {
    const state: RotaryState = {}
    for (let i = this.props.startIndex; i <= this.endIndex; i++) {
      state[i] = Board.buttons.isPressed(i)
    }
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
