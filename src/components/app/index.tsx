import classNames from 'classnames'
import { BoardComonent } from 'components/board'
import { ControlsComponent } from 'components/controls'
import { EditorComponent } from 'components/editor'
import { MemoryComponent } from 'components/memory'
import { RegistersComponent } from 'components/registers'
import React from 'react'
import './style.css'

interface AppState {
  showEditor: boolean
  showBoard: boolean
}

export class AppComponent extends React.Component<{}, AppState> {
  private editor: React.RefObject<EditorComponent>

  public constructor(props: {}) {
    super(props)
    this.editor = React.createRef<EditorComponent>()
    this.state = {
      showEditor: true,
      showBoard: false
    }
  }

  public showEditor() {
    this.setState({
      showEditor: true,
      showBoard: false
    })
  }

  public showBoard() {
    this.setState({
      showEditor: false,
      showBoard: true
    })
  }

  public render(): React.ReactNode {
    return (
      <div
        id="popover-boundary"
        className={classNames('app-component', {
          'show-editor': this.state.showEditor,
          'show-board': this.state.showBoard
        })}>
        <div className="title-container">
          <div className="app-title">
            <div className="title-bar">
              <h4 className="m-0">Virtual CT-Board</h4>
            </div>
          </div>
        </div>
        <div className="menu-container">
          <div className="menu">
            <div className="menu-bar">
              <button
                className="btn btn-sm btn-primary"
                disabled={this.state.showEditor}
                onClick={() => this.showEditor()}>
                <i className="fa fa-code"></i>
              </button>
              <button
                className="btn btn-sm btn-primary"
                disabled={this.state.showBoard}
                onClick={() => this.showBoard()}>
                <i className="fa fa-square-o"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="controls-container">
          <ControlsComponent editor={this.editor} />
        </div>
        <div className="editor-container">
          <EditorComponent ref={this.editor} />
        </div>
        <div className="registers-container">
          <RegistersComponent />
        </div>
        <div className="memory-container">
          <MemoryComponent />
        </div>
        <div className="board-container">
          <BoardComonent />
        </div>
      </div>
    )
  }
}
