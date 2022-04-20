import React from 'react'
import CodeMirror, { Text } from '@uiw/react-codemirror'

import { assemble } from 'assembler'
import { IELF } from 'assembler/elf'

import Board from 'board'

import { Assembly } from './assembly'

import './style.css'

enum EditorMode {
  EDIT,
  RUN,
  STEP
}

interface EditorState {
  mode: EditorMode
  showInfoBox: boolean
  showError: boolean
  errorMessage: string
}

export class EditorComponent extends React.Component<{}, EditorState> {
  /** @see https://codemirror.net/6/docs/ref/#text */
  private editorContent: Text = Text.of([''])

  constructor(props: {}) {
    super(props)
    Board.processor.on('endOfCode', () =>
      this.setState({ mode: EditorMode.EDIT })
    )
  }

  state: EditorState = {
    mode: EditorMode.EDIT,
    showInfoBox: false,
    showError: false,
    errorMessage: ''
  }

  resetProcessor(): void {
    Board.processor.reset()
    this.setState(() => ({
      mode: EditorMode.EDIT
    }))
  }

  runOrHalt(): void {
    if (this.state.mode === EditorMode.EDIT) {
      this.catchAndShowError(() => {
        const executable: IELF = assemble(this.editorContent.toString())
        Board.loadExecutable(executable)
        Board.processor.execute()
        this.setState({
          mode: EditorMode.RUN
        })
      })
    } else if (this.state.mode === EditorMode.RUN) {
      Board.processor.halt()
      this.setState({
        mode: EditorMode.STEP
      })
    } else if (this.state.mode === EditorMode.STEP) {
      Board.processor.execute()
      this.setState({
        mode: EditorMode.RUN
      })
    }
  }

  step(): void {
    if (this.state.mode === EditorMode.EDIT) {
      this.catchAndShowError(() => {
        const executable: IELF = assemble(this.editorContent.toString())
        Board.loadExecutable(executable)
        this.setState({
          mode: EditorMode.STEP
        })
      })
    } else if (this.state.mode === EditorMode.STEP) {
      Board.processor.step()
    }
  }

  toggleInfoBox(): void {
    this.setState((state) => ({
      showInfoBox: !state.showInfoBox
    }))
  }

  catchAndShowError(action: () => void) {
    try {
      action()
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessage: string = err.message
        this.setState({
          showError: true,
          errorMessage: errorMessage
        })
        setTimeout(() => this.setState({ showError: false }), 5000)
      }
    }
  }

  render(): React.ReactNode {
    return (
      <div>
        <div className="pt-1 pb-1">
          <div className="row">
            <div className="col">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => this.toggleInfoBox()}>
                <i
                  className={
                    this.state.showInfoBox ? 'fa fa-times' : 'fa fa-info'
                  }
                  aria-hidden="true"></i>
              </button>
              <span className="ms-3">Mode: {EditorMode[this.state.mode]}</span>
            </div>
            <div className="col text-end">
              <button
                className="btn btn-primary btn-sm"
                title="Reset"
                disabled={this.state.mode == EditorMode.EDIT}
                onClick={() => this.resetProcessor()}>
                <i className="fa fa-stop" aria-hidden="true" />
              </button>
              <button
                className="btn btn-primary btn-sm ms-1"
                title={
                  this.state.mode == EditorMode.EDIT
                    ? 'Run'
                    : this.state.mode === EditorMode.STEP
                    ? 'Continue'
                    : 'Halt'
                }
                onClick={() => this.runOrHalt()}>
                <i
                  className={
                    this.state.mode == EditorMode.EDIT ||
                    this.state.mode == EditorMode.STEP
                      ? 'fa fa-play'
                      : 'fa fa-pause'
                  }
                  aria-hidden="true"
                />
              </button>
              <button
                className="btn btn-primary btn-sm ms-1"
                title={
                  this.state.mode === EditorMode.STEP
                    ? 'Step Over'
                    : 'Step Into'
                }
                disabled={this.state.mode == EditorMode.RUN}
                onClick={() => this.step()}>
                <i
                  className={
                    this.state.mode == EditorMode.STEP
                      ? 'fa fa-forward'
                      : 'fa fa-step-forward'
                  }
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
        <div
          className={
            this.state.showError
              ? 'alert alert-danger'
              : 'alert alert-danger d-none'
          }>
          Error occurred: {this.state.errorMessage}
        </div>
        <div
          className={
            this.state.showInfoBox
              ? 'info-container d-block'
              : 'info-container d-none'
          }>
          <p>
            EDIT: You can edit the code and either run it or step into it <br />
            RUN: Your code is being executed and you can either reset or halt
            the execution <br />
            STEP: Your code is halted and you can either step over the next
            instruction or continue normal execution
          </p>
        </div>
        <CodeMirror
          height="700px"
          theme="dark"
          editable={this.state.mode == EditorMode.EDIT}
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
