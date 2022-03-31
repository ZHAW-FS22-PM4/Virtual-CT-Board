import React from 'react'
import { $enum } from 'ts-enum-util'

import Board from 'board'
import { Register } from 'board/registers'

import './style.css'

type RegisterState = {
  [key: string]: string
}

export class RegisterComponent extends React.Component<{}, RegisterState> {
  constructor(props: {}) {
    super(props)
    Board.processor.on('afterCycle', this.afterCycle)
    this.state = this.getState()
  }

  private afterCycle() {
    this.setState(this.getState())
  }

  private getState() {
    const state: RegisterState = {}
    for (const register of $enum(Register).getValues()) {
      if (register == Register.APSR) continue
      const name = Register[register]
      state[name] = '0x' + Board.registers.readRegister(register).toHexString()
    }
    return state
  }

  public render(): React.ReactNode {
    return (
      <div className="register-container">
        <h4 className="title">Register</h4>
        <div className="register">
          {Object.keys(this.state).map((key) => (
            <div className="row mx-2 my-1" key={'register_' + key}>
              <div className="col-sm-4">{key}</div>
              <div className="col-sm-8">{this.state[key]}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
