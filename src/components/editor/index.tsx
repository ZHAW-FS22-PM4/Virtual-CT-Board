import CodeMirror, { Text } from '@uiw/react-codemirror'
import { assemble } from 'assembler'
import { IELF } from 'assembler/elf'
import Board from 'board'
import { Buffer } from 'buffer'
import React from 'react'
import { Assembly } from './assembly'
import './style.css'

interface EditorState {
  processorRunning: boolean
  showInfoBox: boolean
  editMode: boolean
  showError: boolean
  errorMessage: string
}

export class EditorComponent extends React.Component<{}, EditorState> {
  /** @see https://codemirror.net/6/docs/ref/#text */
  private editorContent: Text = Text.of([''])
  private static SESSION_STORAGE_KEY: string = 'vcb_storage_editorContent'
  private static BASE64_LINE_SEPARATOR: string = '_-_'

  state: EditorState = {
    processorRunning: false,
    showInfoBox: false,
    editMode: true,
    showError: false,
    errorMessage: ''
  }

  resetProcessor = (): void => {
    Board.processor.reset()

    this.setState(() => ({
      processorRunning: false,
      editMode: true
    }))
  }

  runOrHalt = (): void => {
    if (this.state.processorRunning) {
      Board.processor.halt()
    } else {
      if (this.state.editMode) {
        try {
          const file: IELF = assemble(this.editorContent.toString())
          Board.loadExecutable(file)
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage: string = err.message
            this.setState(() => ({
              showError: true,
              errorMessage: errorMessage
            }))

            setTimeout(() => this.setState(() => ({ showError: false })), 2000)
          }

          return
        }

        this.setState(() => ({
          editMode: false
        }))
      }

      Board.processor.execute()
    }

    this.setState((state) => ({
      processorRunning: !state.processorRunning
    }))
  }

  toggleInfoBox = (): void => {
    this.setState((state) => ({
      showInfoBox: !state.showInfoBox
    }))
  }

  render(): React.ReactNode {
    this.readEditorContentFromSession()
    return (
      <div>
        <div className="pt-1 pb-1">
          <div className="row">
            <div className="col">
              <button
                className="btn btn-sm btn-secondary"
                onClick={this.toggleInfoBox}>
                <i
                  className={
                    this.state.showInfoBox ? 'fa fa-times' : 'fa fa-info'
                  }
                  aria-hidden="true"></i>
              </button>
            </div>
            <div className="col text-end">
              <button
                className="btn btn-primary btn-sm"
                title="Reset Processor"
                disabled={this.state.editMode}
                onClick={this.resetProcessor}>
                <i className="fa fa-refresh" aria-hidden="true" />
              </button>
              <button
                className="btn btn-primary btn-sm ms-1"
                onClick={this.runOrHalt}>
                <i
                  className={
                    this.state.processorRunning ? 'fa fa-pause' : 'fa fa-play'
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
            Intially, the code editor should be in edit mode so you should be
            able to insert your code below. When ready, click on the execute
            button on the top right to compile and execute your program. Editing
            will then no longer be possible. You can now either halt the
            execution of your program at a certain point or return to editing
            mode by resetting the processor by using the reset button.
          </p>
        </div>
        <CodeMirror
          height="700px"
          theme="dark"
          value={`${this.editorContent}`}
          editable={this.state.editMode}
          extensions={[Assembly()]}
          onChange={(value, viewUpdate) => {
            // a bit ugly but this ensures that the editor content is always up to date
            this.editorContent = viewUpdate.state.doc
            this.writeEditorContentToSession()
          }}
        />
      </div>
    )
  }

  writeEditorContentToSession(): void {
    const allEditorLinesSeparated: string = this.editorContent
      .toJSON()
      .join(EditorComponent.BASE64_LINE_SEPARATOR)
    sessionStorage.setItem(
      EditorComponent.SESSION_STORAGE_KEY,
      Buffer.from(allEditorLinesSeparated).toString('base64')
    )
  }

  readEditorContentFromSession(): void {
    const editorContentInSession = sessionStorage.getItem(
      EditorComponent.SESSION_STORAGE_KEY
    )
    if (!editorContentInSession) {
      return
    }
    let plainEditorContent = Buffer.from(
      editorContentInSession,
      'base64'
    ).toString('utf8')
    this.editorContent = Text.of(
      plainEditorContent.split(EditorComponent.BASE64_LINE_SEPARATOR)
    )
  }
}
