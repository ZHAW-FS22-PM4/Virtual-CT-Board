import React from 'react'
import { DipSwitch } from './dip-switch'

import './style.css'

export class Board extends React.Component {
  public render(): React.ReactNode {
    return (
      <div className="board-container">
        <h4 className="title">Board</h4>
        <div className="row">
          <div className="col-sm-3 offset-sm-6">
            <DipSwitch />
            <DipSwitch />
          </div>
          <div className="col-sm-3">
            <DipSwitch />
            <DipSwitch />
          </div>
        </div>
      </div>
    )
  }
}
