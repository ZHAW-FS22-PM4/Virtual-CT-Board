import Board from 'board'
import React from 'react'
import './style.css'

type LcdState = {
  displayValueRow0: String[]
  displayValueRow1: String[]
  greenOpacity: number
  redOpacity: number
  blueOpacity: number
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
    const brightness = Board.lcdDisplay.getColour()
    let redBright = this.byteValueToPercent(
      this.scaleDownToByteValue(brightness[0].value)
    )
    let greenBright = this.byteValueToPercent(
      this.scaleDownToByteValue(brightness[1].value)
    )
    let blueBright = this.byteValueToPercent(
      this.scaleDownToByteValue(brightness[2].value)
    )
    let sumAllBright = greenBright + redBright + blueBright

    if (sumAllBright > 1.0) {
      redBright = redBright / sumAllBright
      greenBright = greenBright / sumAllBright
      blueBright = blueBright / sumAllBright
    }
    const state: LcdState = {
      displayValueRow0: allValuesRow0,
      displayValueRow1: allValuesRow1,
      greenOpacity: greenBright,
      redOpacity: redBright,
      blueOpacity: blueBright
    }
    return state
  }

  private scaleDownToByteValue(value: number): number {
    return value / 255
  }
  private byteValueToPercent(value: number): number {
    return value / 255
  }

  public render(): React.ReactNode {
    //<colour>Background divs in this order since human eye most sensitive to green and then red
    //opacity with rgba here in component so display text is not affected by it
    return (
      <div className="lcd-container">
        <div
          className="h-100"
          id="blueBackground"
          style={{
            background: 'rgb(0,0,255,' + this.getState().blueOpacity + ')'
          }}>
          <div
            className="h-100"
            id="redBackground"
            style={{
              background: 'rgb(255,0,0,' + this.getState().redOpacity + ')'
            }}>
            <div
              className="h-100"
              id="greenBackground"
              style={{
                background: 'rgb(0,255,0,' + this.getState().greenOpacity + ')'
              }}>
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
          </div>
        </div>
      </div>
    )
  }
}
