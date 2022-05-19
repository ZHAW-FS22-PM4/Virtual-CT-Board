import Board from 'board'
import { Flag, Register } from 'board/registers'
import React from 'react'
import { $enum } from 'ts-enum-util'
import './style.css'

type RegistersState = {
  registers: {
    [key: string]: string
  }
  flags: {
    [key: string]: string
  }
}

export class RegistersComponent extends React.Component<{}, RegistersState> {
  constructor(props: {}) {
    super(props)
    this.state = RegistersComponent.getState()
    Board.registers.on('change', () => this.update())
  }

  public update() {
    this.setState(RegistersComponent.getState())
  }

  private static getState() {
    const state: RegistersState = { registers: {}, flags: {} }
    for (const register of $enum(Register).getValues()) {
      if (register == Register.APSR) continue
      const name = Register[register]
      state.registers[name] =
        '0x' + Board.registers.readRegister(register).toHexString()
    }
    for (const flag of $enum(Flag).getValues()) {
      const name = Flag[flag]
      state.flags[name] = Board.registers.isFlagSet(flag) ? '1' : '0'
    }
    return state
  }

  public render(): React.ReactNode {
    return (
      <div className="registers-component">
        <div className="registers-bar bg-light">
          <h4 className="title m-0">Registers</h4>
          <div className="registers">
            {Object.entries(this.state.registers).map(([key, value]) => (
              <div className="register" key={'register_' + key}>
                <div className="name">{key}</div>
                <div className="value">{value}</div>
              </div>
            ))}
          </div>
          <div className="flags">
            {Object.entries(this.state.flags).map(([key, value]) => (
              <div className="flag" key={'flag_' + key}>
                <div className="name">{key}</div>
                <div className="value">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
