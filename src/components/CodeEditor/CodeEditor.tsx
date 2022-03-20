import React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { Assembly } from './assembly'

interface CodeEditorState {
  codeRunning: boolean
}

export class CodeEditor extends React.Component<{}, CodeEditorState> {
  constructor () {
    super({})
    // create board class
  }

  state: CodeEditorState = {
    codeRunning: false
  }

  handleCompileAndReset = (): void => {
    // call reset() function on processor
  }

  handleRunOrHalt = (): void => {
    if (this.state.codeRunning) {
      // call halt() function on processor
    } else {
      // call execute() function on processor
    }

    this.setState((state) => ({
      codeRunning: !state.codeRunning
    }))
  }

  render (): React.ReactNode {
    return (
      <div>
        <div className='text-end pt-1 pb-1'>
          <button className='btn btn-primary btn-sm' title='Compile and Reset' onClick={this.handleCompileAndReset}>
            <i className='fa fa-refresh' aria-hidden='true' />
          </button>
          <button className='btn btn-primary btn-sm ms-1' onClick={this.handleRunOrHalt}>
            <i className={this.state.codeRunning ? 'fa fa-pause' : 'fa fa-play'} aria-hidden='true' />
          </button>
        </div>
        <CodeMirror
          height='700px'
          theme='dark'
          extensions={[Assembly()]}
        />
      </div>
    )
  }
}
