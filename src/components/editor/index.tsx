import React from 'react'
import CodeMirror, { Text } from '@uiw/react-codemirror'

import { Assembly } from './assembly'
import {Processor} from 'board/processor'

interface EditorState {
  codeRunning: boolean
}

export class EditorComponent extends React.Component<{}, EditorState> {
  /**
   * @see https://codemirror.net/6/docs/ref/#text
   */
  private editorContent: Text = Text.of([''])

  state: EditorState = {
    codeRunning: false
  }

  handleCompileAndReset = (): void => {
    Processor.prototype.reset()
  }

  handleRunOrHalt = (): void => {
    if (this.state.codeRunning) {
      Processor.prototype.halt()
    } else {
      Processor.prototype.execute()
    }

    this.setState((state) => ({
      codeRunning: !state.codeRunning
    }))
  }

  render(): React.ReactNode {
    return (
      <div>
        <div className="text-end pt-1 pb-1">
          <button
            className="btn btn-primary btn-sm"
            title="Compile and Reset"
            onClick={this.handleCompileAndReset}>
            <i className="fa fa-refresh" aria-hidden="true" />
          </button>
          <button
            className="btn btn-primary btn-sm ms-1"
            onClick={this.handleRunOrHalt}>
            <i
              className={this.state.codeRunning ? 'fa fa-pause' : 'fa fa-play'}
              aria-hidden="true"
            />
          </button>
        </div>
        <CodeMirror
          height="700px"
          theme="dark"
          extensions={[Assembly()]}
          onChange={(value, viewUpdate) => {
            // a bit ugly but this ensures that the editor content is always up to date
            this.editorContent = viewUpdate.state.doc
          }}
        />
      </div>
    )
  }
}
