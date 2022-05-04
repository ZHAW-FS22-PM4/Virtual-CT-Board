import Board from 'board'
import React from 'react'
import './style.css'
import {Simulate} from "react-dom/test-utils";
import mouseDown = Simulate.mouseDown;

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

  constructor(props: RotaryProbs) {
    super(props)
    this.endIndex = this.props.startIndex + this.props.size - 1
    this.state = this.getState()
    this.rotaryValue = 0
    this.mouseClicked = false
  }

  private getState() {
    const state: RotaryState = {}
    for (let i = this.props.startIndex; i <= this.endIndex; i++) {
      state[i] = Board.buttons.isPressed(i)
    }
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

    this.setState((state) => ({
      [key]: !state[key]
    }))
  }

  private mouseDown = (key:number): void => {
    this.mouseClicked = true
  }

  private mouseUp = (key:number): void => {
    this.mouseClicked = false
  }

  public render(): React.ReactNode {
    return (
      <div className="rotaryswitch-container">
        {Object.keys(this.state).map(Number)
          .map((key) => (
            <div key={'rotaryswitch'}>
              <div className="rotary-display">{"Rotary Value: " + this.rotaryValue}</div>
              <canvas
                  className={`rotaryswitch-canvas`}
                  onMouseDown={() => this.mouseDown(key)}
                  onMouseUp={() => this.mouseUp(key)}
                  onMouseMove={(e) => this.handleRotarySwitch(key, e)}
                />
              <button
                className={`rotaryswitch-button`}
              />
            </div>
          ))}
      </div>
    )
  }

}
