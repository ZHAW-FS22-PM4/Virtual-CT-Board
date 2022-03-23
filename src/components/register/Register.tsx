import React from 'react'
import './Register.css'

export class Register extends React.Component {
  render(): React.ReactNode {

    // TODO: replace dummy register
      const registers = [
          {key: 'R0', value: '0x12345678'},
          {key: 'R1', value: '0x36126354'},
          {key: 'R2', value: '0xFD344623'},
          {key: 'R3', value: '0x1545F112'},
          {key: 'R4', value: '0x23465344'},
          {key: 'R5', value: '0x123F4678'},
          {key: 'R6', value: '0x1AC4CC78'},
          {key: 'R7', value: '0x12345DE8'},
      ]


    return (
        <div className="register-container">
          <h4 className="title">Register</h4>
          <div className="register">
            {registers.map(r =>
                <div className="row mx-2 my-1">
                  <div className="col-sm-4">
                    {r.key}
                  </div>
                  <div className="col-sm-8">
                    {r.value}
                  </div>
                </div>
            )}
          </div>
        </div>
    )
  }


}