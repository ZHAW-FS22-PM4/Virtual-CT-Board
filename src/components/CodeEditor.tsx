import React from 'react'
import CodeMirror from '@uiw/react-codemirror'

type MyState = {
  codeRunning: boolean
}

export class CodeEditor extends React.Component<{}, MyState> {

  constructor() {
    super({})
    // create board class
  }

  state: MyState = {
    codeRunning: false
  }

  compileAndReset = () => {
    // call reset() function on processor
  }

  runOrHalt = () => {
    if (this.state.codeRunning) {
      // call halt() function on processor
    } else {
      // call execute() function on processor
    }

    this.setState((state) => ({
      codeRunning: state.codeRunning ? false : true
    }))
  }

  render (): React.ReactNode {
    return (
      <div>
        <div className="text-end pt-1 pb-1">
          <button className="btn btn-primary btn-sm" title="Compile and Reset" onClick={this.compileAndReset}>
            <i className="fa fa-refresh" aria-hidden="true"></i>
          </button>
          <button className="btn btn-primary btn-sm ms-1" onClick={this.runOrHalt}>
            <i className={this.state.codeRunning ? "fa fa-pause" : "fa fa-play"} aria-hidden="true"></i>
          </button>
        </div>
        <CodeMirror
          value="console.log('hello world!');"
          height="700px"
          theme="dark"
        />
      </div>
    )
  }
}