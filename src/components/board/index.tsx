import React from 'react'
import { DipSwitch } from './dip-switch'

import './style.css'
import { Led } from './led'

export class Board extends React.Component {
  public render(): React.ReactNode {
    return (
      <div className="board-container">
        <h4 className="title">Board</h4>
        <div className="row mx-2 my-1">
          <div className="col-sm-3 offset-sm-6">
            <Led startIndex={24} size={8} />
            <DipSwitch startIndex={24} size={8} />
          </div>
          <div className="col-sm-3">
            <Led startIndex={16} size={8} />
            <DipSwitch startIndex={16} size={8} />
          </div>
        </div>
        <div className="row mx-2 my-1">
          <div className="col-sm-3 offset-sm-6">
            <Led startIndex={8} size={8} />
            <DipSwitch startIndex={8} size={8} />
          </div>
          <div className="col-sm-3">
            <Led startIndex={0} size={8} />
            <DipSwitch startIndex={0} size={8} />
          </div>
        </div>
      </div>
    )
  }
}
