import React from 'react'
import CodeMirror, { Text } from '@uiw/react-codemirror'
import { Assembly } from './assembly'

interface CodeEditorState {
  codeRunning: boolean
}

export class CodeEditor extends React.Component<{}, CodeEditorState> {
  private editorContent: Text = Text.of([''])

  state: CodeEditorState = {
    codeRunning: false
  }

  handleCompileAndReset = (): void => {
    // TODO: call reset() function on processor
  }

  handleRunOrHalt = (): void => {
    if (this.state.codeRunning) {
      // TODO: call halt() function on processor
    } else {
      // TODO: call execute() function on processor
    }

    // access the content of the editor
    // see https://codemirror.net/6/docs/ref/#text
    console.log(this.editorContent.toString())
    console.log()
    if (this.editorContent !== undefined) {
      for (const line of this.editorContent) {
        console.log(line)
      }
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
