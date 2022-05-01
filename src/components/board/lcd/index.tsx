import Board from 'board'
import React from 'react'
import './style.css'

type LcdState = {
  displayValueRow0: String[]
  displayValueRow1: String[]
  backgroundColor: string
}

export class LcdComponent extends React.Component<{}, LcdState> {
  private static readonly LCD_POSITION_COUNT = 40

  constructor(props: {}) {
    super(props)
    Board.processor.on('afterCycle', () => this.update())
    this.state = this.getState()
  }

  private update() {
    return this.setState(this.getState())
  }

  private getState() {
    let allValuesRow0: String[] = []
    for (
      let i = LcdComponent.LCD_POSITION_COUNT - 1;
      i >= LcdComponent.LCD_POSITION_COUNT / 2;
      i--
    ) {
      allValuesRow0.push(Board.lcdDisplay.getDisplayValue(i))
    }
    let allValuesRow1: String[] = []
    for (let i = LcdComponent.LCD_POSITION_COUNT / 2 - 1; i >= 0; i--) {
      allValuesRow1.push(Board.lcdDisplay.getDisplayValue(i))
    }
    const state: LcdState = {
      displayValueRow0: allValuesRow0,
      displayValueRow1: allValuesRow1,
      backgroundColor: Board.lcdDisplay.getColourHex()
    }
    return state
  }

  public render(): React.ReactNode {
    return (
      <div
        className="lcd-container"
        style={{ backgroundColor: this.state.backgroundColor }}>
        <div className="row justify-content-md-center">
          {Object.keys(this.state.displayValueRow0).map((key) => (
            <div key={'lcd_row0_val_' + key} className="lcdChar">
              {this.state.displayValueRow0[parseInt(key)]}
            </div>
          ))}
        </div>
        <div className="row justify-content-md-center">
          {Object.keys(this.state.displayValueRow1).map((key) => (
            <div key={'lcd_row1_val_' + key} className="lcdChar">
              {this.state.displayValueRow1[parseInt(key)]}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
