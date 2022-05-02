import Board from 'board'
import React from 'react'
import './style.css'

type SevenSegState = {
  [key: number]: boolean
}

type SevenSegProps = {

}

export class SevenSegComponent extends React.Component<SevenSegProps, SevenSegState> {

  constructor(props: SevenSegProps) {
    super(props)
    this.state = this.getState()
  }

  private getState() {
    const state: SevenSegState = {}
    return state
  }

  public render(): React.ReactNode {
    return (
      <div className="seven-seg-container">
        <div id="display-1" className="display-container display-size-12 display-no-0">
          <div className="segment-x segment-a"><span className="segment-border"/></div>
          <div className="segment-y segment-b"><span className="segment-border"/></div>
          <div className="segment-y segment-c"><span className="segment-border"/></div>
          <div className="segment-x segment-d"><span className="segment-border"/></div>
          <div className="segment-y segment-e"><span className="segment-border"/></div>
          <div className="segment-y segment-f"><span className="segment-border"/></div>
          <div className="segment-x segment-g"><span className="segment-border"/></div>
        </div>
      </div>
    )
  }
}
