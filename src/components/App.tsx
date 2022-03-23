import React from 'react'

import { EditorComponent } from 'components/editor'
import { RegisterComponent } from 'components/register'
import { FlagsComponent } from 'components/flags'

export class App extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <EditorComponent />
          </div>
          <div className="col-md-2">
            <RegisterComponent />
            <FlagsComponent />
          </div>
          <div className="col-md-6">CT Board...</div>
        </div>
      </div>
    )
  }
}
