import Board from 'board'
import classNames from 'classnames'
import React from 'react'
import './style.css'

export type SevenSegProps = {
  displayId: number
}

type SevenSegState = {
  segState: boolean[]
}

export class SevenSegmentComponent extends React.Component<
  SevenSegProps,
  SevenSegState
> {
  constructor(props: SevenSegProps) {
    super(props)
    this.state = this.getState()
    Board.sevenSegment.on('change', () => this.update())
  }

  public update() {
    return this.setState(this.getState())
  }

  private getState(): SevenSegState {
    return { segState: Board.sevenSegment.getDisplay(this.props.displayId) }
  }

  public render(): React.ReactNode {
    return (
      <div className="seven-segment-component">
        <div className="label">{'DS' + this.props.displayId}</div>
        <div className="display bg-secondary">
          <div className="segments">
            <div
              className={classNames('segment segment-x segment-a', {
                'segment-on': this.state.segState[7]
              })}
            />
            <div
              className={classNames('segment segment-y segment-b', {
                'segment-on': this.state.segState[6]
              })}
            />
            <div
              className={classNames('segment segment-y segment-c', {
                'segment-on': this.state.segState[5]
              })}
            />
            <div
              className={classNames('segment segment-x segment-d', {
                'segment-on': this.state.segState[4]
              })}
            />
            <div
              className={classNames('segment segment-y segment-e', {
                'segment-on': this.state.segState[3]
              })}
            />
            <div
              className={classNames('segment segment-y segment-f', {
                'segment-on': this.state.segState[2]
              })}
            />
            <div
              className={classNames('segment segment-x segment-g', {
                'segment-on': this.state.segState[1]
              })}
            />
            <div
              className={classNames('segment segment-dp', {
                'segment-on': this.state.segState[0]
              })}
            />
          </div>
        </div>
      </div>
    )
  }
}
