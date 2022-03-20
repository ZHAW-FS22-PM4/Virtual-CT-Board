import React from 'react'

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
                Registers...
              </div>
              <div className="col-md-6">
                CT Board...
              </div>
            </div>
          </div>
        )
    }
}