import { assemble } from 'assembler'
import { AssemblerError } from 'assembler/error'
import Board from 'board'
import { Register } from 'board/registers'
import * as bootstrap from 'bootstrap'
import { EditorComponent } from 'components/editor'
import $ from 'jquery'
import React from 'react'
import './style.css'

export interface IControlsProps {
  editor: React.RefObject<EditorComponent>
}

enum ControlsMode {
  EDIT,
  RUN,
  STEP
}

interface ControlsState {
  mode: ControlsMode
  showInfoBox: boolean
}

export class ControlsComponent extends React.Component<
  IControlsProps,
  ControlsState
> {
  private helpButton: React.RefObject<HTMLButtonElement>

  public constructor(props: IControlsProps) {
    super(props)
    this.helpButton = React.createRef<HTMLButtonElement>()
    this.state = {
      mode: ControlsMode.EDIT,
      showInfoBox: false
    }
    Board.processor.on('endOfCode', () =>
      this.setState({ mode: ControlsMode.EDIT })
    )
    Board.processor.on('error', (message) => {
      this.updateProgramCounterHighlighting(true)
      this.getEditor().showError(message, this.getProgramCounterLine())
      this.setState({ mode: ControlsMode.EDIT })
    })
  }

  public componentDidMount(): void {
    const popover = new bootstrap.Popover(this.helpButton.current!, {
      customClass: 'help-popover',
      html: true,
      title: 'Help',
      content: document.querySelector('#help-popover-template')!,
      placement: 'bottom',
      boundary: document.querySelector('#popover-boundary')!,
      offset: [0, 7]
    })
    $('body').on('click', (e) => {
      if ($(e.target).closest('.help-popover-trigger').length) return
      if (!$(e.target).closest('.help-popover').length) popover.hide()
    })
  }

  public resetProcessor(): void {
    Board.processor.reset()
    this.setState({ mode: ControlsMode.EDIT })
    this.updateProgramCounterHighlighting(true)
  }

  public runOrHalt(): void {
    let nextMode = this.state.mode
    if (this.state.mode === ControlsMode.EDIT) {
      this.catchAndReportError(() => {
        const executable = assemble(this.getEditor().getCode())
        Board.loadExecutable(executable)
        Board.processor.execute()
        nextMode = ControlsMode.RUN
      })
    } else if (this.state.mode === ControlsMode.RUN) {
      Board.processor.halt()
      nextMode = ControlsMode.STEP
    } else if (this.state.mode === ControlsMode.STEP) {
      Board.processor.execute()
      nextMode = ControlsMode.RUN
    }
    this.setState({ mode: nextMode })
    this.updateProgramCounterHighlighting(nextMode != ControlsMode.STEP)
  }

  public step(): void {
    if (this.state.mode === ControlsMode.EDIT) {
      this.catchAndReportError(() => {
        const executable = assemble(this.getEditor().getCode())
        Board.loadExecutable(executable)
        this.setState({
          mode: ControlsMode.STEP
        })
      })
    } else if (this.state.mode === ControlsMode.STEP) {
      if (!Board.processor.step()) {
        return
      }
    }
    this.updateProgramCounterHighlighting()
  }

  private updateProgramCounterHighlighting(clear: boolean = false) {
    let line: number | null = null
    if (!clear) {
      line = this.getProgramCounterLine()
    }
    this.getEditor().highlightStep(line)
  }

  private catchAndReportError(action: () => void) {
    const editor = this.getEditor()
    try {
      action()
      editor.clearError()
    } catch (err: any) {
      if (err instanceof Error) {
        let line: number | null = null
        if (err instanceof AssemblerError) {
          line = err.line
        }
        editor.showError(err.message, line)
      }
    }
  }

  private getProgramCounterLine(): number | null {
    const executable = Board.getExecutable()
    let line: number | null = null
    if (executable) {
      const pc = Board.registers.readRegister(Register.PC)
      line = executable.sourceMap.getLine(pc) || null
    }
    return line
  }

  public render(): React.ReactNode {
    return (
      <div className="controls-component">
        <div className="controls-bar bg-light">
          <div className="left-controls">
            <button
              className="btn btn-primary btn-sm ms-2"
              title="Reset"
              disabled={this.state.mode == ControlsMode.EDIT}
              onClick={() => this.resetProcessor()}>
              <i className="fa fa-stop" />
            </button>
            <button
              className="btn btn-primary btn-sm ms-2"
              title={
                this.state.mode == ControlsMode.EDIT
                  ? 'Run'
                  : this.state.mode === ControlsMode.STEP
                  ? 'Continue'
                  : 'Halt'
              }
              onClick={() => this.runOrHalt()}>
              <i
                className={
                  this.state.mode == ControlsMode.EDIT ||
                  this.state.mode == ControlsMode.STEP
                    ? 'fa fa-play'
                    : 'fa fa-pause'
                }
              />
            </button>
            <button
              className="btn btn-primary btn-sm ms-2"
              title={
                this.state.mode === ControlsMode.STEP
                  ? 'Step Over'
                  : 'Step Into'
              }
              disabled={this.state.mode == ControlsMode.RUN}
              onClick={() => this.step()}>
              <i
                className={
                  this.state.mode == ControlsMode.STEP
                    ? 'fa fa-forward'
                    : 'fa fa-step-forward'
                }
              />
            </button>
            <span className="badge bg-secondary ms-3">
              {ControlsMode[this.state.mode]}
            </span>
          </div>
          <div className="right-controls">
            <button
              ref={this.helpButton}
              className="help-popover-trigger btn btn-secondary btn-sm me-2">
              <i className="fa fa-question"></i>
            </button>
          </div>
        </div>
        <div className="d-none">
          <div id="help-popover-template">
            <p>
              <b>EDIT:</b> You can edit the code and either run it or step into
              it.
            </p>
            <p>
              <b>RUN:</b> Your code is being executed and you can either reset
              or halt the execution.
            </p>
            <p className="mb-0">
              <b>STEP:</b> Your code is halted and you can either step over the
              next instruction or continue normal execution.
            </p>
          </div>
        </div>
      </div>
    )
  }

  private getEditor(): EditorComponent {
    return this.props.editor.current!
  }
}
