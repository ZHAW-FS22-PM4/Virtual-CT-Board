import React from 'react'
import { SevenSegComponent } from './7seg'
import { Button } from './button'
import { DipSwitch } from './dip-switch'
import { LedComponent } from './led'
import './style.css'

export class BoardComonent extends React.Component {
  public render(): React.ReactNode {
    return (
      <div className="board-container">
        <h4 className="title">Board</h4>
        <div className="row mx-2 my-1">
          <div className="col-sm-3 offset-sm-6">
            <LedComponent startIndex={24} size={8} />
            <DipSwitch startIndex={24} size={8} />
          </div>
          <div className="col-sm-3">
            <LedComponent startIndex={16} size={8} />
            <DipSwitch startIndex={16} size={8} />
          </div>
        </div>
        <div className="row mx-2 my-1">
          <SevenSegComponent displayId={3} />
          <SevenSegComponent displayId={2} />
          <SevenSegComponent displayId={1} />
          <SevenSegComponent displayId={0} />
        </div>
        <div className="row mx-2 my-1">
          <div className="col-sm-3">
            <Button startIndex={0} size={4} />
          </div>
          <div className="col-sm-3 offset-sm-3">
            <LedComponent startIndex={8} size={8} />
            <DipSwitch startIndex={8} size={8} />
          </div>
          <div className="col-sm-3">
            <LedComponent startIndex={0} size={8} />
            <DipSwitch startIndex={0} size={8} />
          </div>
        </div>
      </div>
    )
  }
}
