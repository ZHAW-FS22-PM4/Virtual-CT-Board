import React from 'react'
import Board from '../../../board'
import './style.css'

type SevenSegState = {
  segState: boolean[]
}

type SevenSegProps = {
  displayId: number
}

export class SevenSegComponent extends React.Component<
  SevenSegProps,
  SevenSegState
> {
  constructor(props: SevenSegProps) {
    super(props)
    this.state = this.getState()
    Board.processor.on('afterCycle', () => this.update())
  }

  private update() {
    return this.setState(this.getState())
  }

  private getState(): SevenSegState {
    return { segState: Board.sevenSeg.getDisplay(this.props.displayId) }
  }

  public render(): React.ReactNode {
    return (
      <div className="seven-seg-container">
        <div
          id={'DS' + this.props.displayId}
          className="display-container display-size-12">
          <div
            className="segment-x segment-a"
            style={this.state.segState[7] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-y segment-b"
            style={this.state.segState[6] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-y segment-c"
            style={this.state.segState[5] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-x segment-d"
            style={this.state.segState[4] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-y segment-e"
            style={this.state.segState[3] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-y segment-f"
            style={this.state.segState[2] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-x segment-g"
            style={this.state.segState[1] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-dp"
            style={this.state.segState[0] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
        </div>
      </div>
    )
  }
}
