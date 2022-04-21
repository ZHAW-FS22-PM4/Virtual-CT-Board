import { EditorComponent } from 'components/editor'
import { FlagsComponent } from 'components/flags'
import { RegisterComponent } from 'components/register'
import React from 'react'
import { BoardComonent } from './board'
import { MemoryExplorerComponent } from './memoryexplorer'

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
          <div className="col-md-6">
            <BoardComonent />
          </div>
        </div>
        <MemoryExplorerComponent />
      </div>
    )
  }
}
