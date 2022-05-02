import React from 'react'
import './style.css'

type SevenSegState = {
  [key: number]: boolean
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
  }

  private getState() {
    const state: SevenSegState = {}
    state[0] = false
    return state
  }

  public render(): React.ReactNode {
    return (
      <div className="seven-seg-container">
        <div
          id={'DS' + this.props.displayId}
          className="display-container display-size-12">
          <div
            className="segment-x segment-a"
            style={this.state[0] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-y segment-b"
            style={this.state[1] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-y segment-c"
            style={this.state[2] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-x segment-d"
            style={this.state[3] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-y segment-e"
            style={this.state[4] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-y segment-f"
            style={this.state[5] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-x segment-g"
            style={this.state[6] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
          <div
            className="segment-dp"
            style={this.state[7] ? { opacity: 1 } : { opacity: 0.1 }}>
            <span className="segment-border" />
          </div>
        </div>
      </div>
    )
  }
}
