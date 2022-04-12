import React from 'react'
import { Button } from './button'
import { DipSwitch } from './dip-switch'
import './style.css'

export class Board extends React.Component {
  public render(): React.ReactNode {
    return (
      <div className="board-container">
        <h4 className="title">Board</h4>
        <div className="row mx-2 my-1">
          <div className="col-sm-3 offset-sm-6">
            <DipSwitch startIndex={24} size={8} />
          </div>
          <div className="col-sm-3">
            <DipSwitch startIndex={16} size={8} />
          </div>
        </div>
        <div className="row mx-2 my-1">
          <div className="col-sm-3">
            <Button startIndex={0} size={4} />
          </div>
          <div className="col-sm-3 offset-sm-3">
            <DipSwitch startIndex={8} size={8} />
          </div>
          <div className="col-sm-3">
            <DipSwitch startIndex={0} size={8} />
          </div>
        </div>
      </div>
    )
  }
}
