import React from 'react'
import {Register} from "./register/Register";

export class App extends React.Component {
    render (): React.ReactNode {
        return (
            <div className="m-3">
              <h1>Virtual CT Board</h1>
              <div className="container">
                <div className="row">
                  <div className="col-sm">
                    Code Editor ...
                  </div>
                  <div className="col-sm">
                    <Register/>
                  </div>
                  <div className="col-sm">
                    Board ...
                  </div>
                </div>
              </div>

            </div>
        )
    }
}