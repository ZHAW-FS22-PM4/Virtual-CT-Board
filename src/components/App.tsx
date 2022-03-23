import React from 'react'
import {Register} from "./register/Register";
import { StatusFlags } from './register/StatusFlags';

import { CodeEditor } from './CodeEditor/CodeEditor'

export class App extends React.Component {
    render (): React.ReactNode {
        return (
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4">
                <CodeEditor />
              </div>
              <div className="col-md-2">
                <Register />
                <StatusFlags />
              </div>
              <div className="col-md-6">
                CT Board...
              </div>
            </div>
          </div>
        )
    }
}
