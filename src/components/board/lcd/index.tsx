import Board from 'board'
import React from 'react'
import './style.css'

interface ILcdState {
  line0: String[]
  line1: String[]
  red: number
  green: number
  blue: number
}

export class LcdComponent extends React.Component<{}, ILcdState> {
  private static readonly LINE_LENGTH = 20

  constructor(props: {}) {
    super(props)
    this.state = LcdComponent.getState()
    Board.lcdDisplay.on('change', () => this.update())
  }

  public update() {
    return this.setState(LcdComponent.getState())
  }

  private static getState() {
    const line0 = Array.from({ length: LcdComponent.LINE_LENGTH }, (_, i) =>
      Board.lcdDisplay.getDisplayValue(i)
    )
    const line1 = Array.from({ length: LcdComponent.LINE_LENGTH }, (_, i) =>
      Board.lcdDisplay.getDisplayValue(LcdComponent.LINE_LENGTH + i)
    )
    let [red, green, blue] = Board.lcdDisplay.getColor()
    return { line0, line1, red, green, blue }
  }

  public render(): React.ReactNode {
    return (
      <div className="lcd-component">
        <div className="lcd-screen">
          <div
            className="lcd-color"
            style={{
              background: `rgb(${this.state.red}, ${this.state.green}, ${this.state.blue})`
            }}></div>
          <div className="lcd-text">
            <div className="lcd-line">
              {this.state.line0.map((char, i) => (
                <span key={'lcd_line_0_' + i} className="lcd-char">
                  {char}
                </span>
              ))}
            </div>
            <div className="lcd-line">
              {this.state.line1.map((char, i) => (
                <span key={'lcd_line_1_' + i} className="lcd-char">
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
