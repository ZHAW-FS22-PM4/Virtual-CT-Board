import CodeMirror, {
  Compartment,
  Decoration,
  EditorView,
  Extension,
  ReactCodeMirrorRef
} from '@uiw/react-codemirror'
import { assemble } from 'assembler'
import { AssemblerError } from 'assembler/error'
import Board from 'board'
import { Register } from 'board/registers'
import React from 'react'
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
  private static SESSION_STORAGE_KEY: string = 'vcb_storage_editorContent'
  private static ERROR_HIGHLIGHTING_CLASS: string = 'error-highlighting'
  private static STEP_HIGHLIGHTING_CLASS: string = 'step-highlighting'
  private configuration: Compartment
  private editor: React.RefObject<ReactCodeMirrorRef>

  constructor(props: {}) {
    super(props)
    this.state = {
      mode: EditorMode.EDIT,
      showInfoBox: false,
      showError: false,
      errorMessage: ''
    }
    this.configuration = new Compartment()
    this.editor = React.createRef<ReactCodeMirrorRef>()
    Board.processor.on('endOfCode', () =>
      this.setState({ mode: EditorMode.EDIT })
    )

    Board.processor.on('runtimeError', (message: string) => {
      this.clearHighlightings()
      this.updateProgramCounterHighlighting(
        EditorComponent.ERROR_HIGHLIGHTING_CLASS
      )
      this.setState({
        showError: true,
        errorMessage: message,
        mode: EditorMode.EDIT
      })
    })
  }

  resetProcessor(): void {
    Board.processor.reset()
    this.setState({ mode: EditorMode.EDIT })
    this.clearHighlightings()
  }

  runOrHalt(): void {
    let nextMode = this.state.mode
    if (this.state.mode === EditorMode.EDIT) {
      this.catchAndShowError(() => {
        const executable = assemble(this.getCode())
        Board.loadExecutable(executable)

        // in case of runtime error processor is not reset so whenever the code is compiled successfully again
        // reset the processor to make sure everything is ready for next execution
        Board.processor.reset()

        Board.processor.execute()
        nextMode = EditorMode.RUN
      })
    } else if (this.state.mode === EditorMode.RUN) {
      Board.processor.halt()
      nextMode = EditorMode.STEP
      this.updateProgramCounterHighlighting()
    } else if (this.state.mode === EditorMode.STEP) {
      Board.processor.execute()
      nextMode = EditorMode.RUN
      this.clearHighlightings()
    }
    this.setState({ mode: nextMode })
  }

  step(): void {
    if (this.state.mode === EditorMode.EDIT) {
      this.catchAndShowError(() => {
        const executable = assemble(this.getCode())
        Board.loadExecutable(executable)

        // in case of runtime error processor is not reset so whenever the code is compiled successfully again
        // reset the processor to make sure everything is ready for next execution
        Board.processor.reset()

        this.setState({
          mode: EditorMode.STEP
        })
      })
    } else if (this.state.mode === EditorMode.STEP) {
      Board.processor.step()
    }
    this.updateProgramCounterHighlighting()
  }

  toggleInfoBox(): void {
    this.setState((state) => ({
      showInfoBox: !state.showInfoBox
    }))
  }

  updateProgramCounterHighlighting(
    className: string = EditorComponent.STEP_HIGHLIGHTING_CLASS
  ) {
    const executable = Board.getExecutable()
    let line: number | undefined
    if (executable) {
      const pc = Board.registers.readRegister(Register.PC)
      line = executable.sourceMap.getLine(pc)
    }

    if (line) this.highlightLine(line + 1, className)
  }

  highlightLine(line: number, className: string): void {
    const view = this.editor.current?.view
    if (view) {
      const decorations: Extension[] = []
      const decoration = Decoration.line({
        class: className
      })
      const position = view.state.doc.line(line).from
      decorations.push(
        EditorView.decorations.of(Decoration.set(decoration.range(position)))
      )
      const effect = this.configuration.reconfigure(decorations)
      view.dispatch({ effects: [effect] })
    }
  }

  clearHighlightings(): void {
    const view = this.editor.current?.view
    if (view) {
      const decorations: Extension[] = []
      const effect = this.configuration.reconfigure(decorations)
      view.dispatch({ effects: [effect] })
    }
  }

  catchAndShowError(action: () => void) {
    this.clearHighlightings()

    try {
      action()
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessage: string = err.message
        this.setState({
          showError: true,
          errorMessage: errorMessage
        })
      }

      if (err instanceof AssemblerError) {
        this.highlightLine(
          err.line + 1,
          EditorComponent.ERROR_HIGHLIGHTING_CLASS
        )
      }
    }
  }

  getCode(): string {
    const doc = this.editor.current?.view?.state.doc
    return doc ? doc.toString() : ''
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
          ref={this.editor}
          height="700px"
          theme="dark"
          value={
            sessionStorage.getItem(EditorComponent.SESSION_STORAGE_KEY) ||
            undefined
          }
          editable={this.state.mode == EditorMode.EDIT}
          extensions={[this.configuration.of([]), Assembly()]}
          onChange={(value: string) => {
            if (this.state.showError) {
              this.clearHighlightings()
              this.setState({ showError: false })
            }
            sessionStorage.setItem(EditorComponent.SESSION_STORAGE_KEY, value)
          }}
        />
      </div>
    )
  }
}
