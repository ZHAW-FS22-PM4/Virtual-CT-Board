import CodeMirror, {
  Compartment,
  Decoration,
  EditorView,
  Extension,
  ReactCodeMirrorRef
} from '@uiw/react-codemirror'
import classNames from 'classnames'
import React from 'react'
import { Assembly } from './plugins/assembly'
import './style.css'

interface IEditorState {
  isEditable: boolean
  errorMessage: string | null
}

interface IEditorHighlithings {
  [name: string]: Compartment
}

export class EditorComponent extends React.Component<{}, IEditorState> {
  private static SESSION_STORAGE_KEY: string = 'vcb_storage_editorContent'
  private static ERROR_HIGHLIGHTING = 'error-highlighting'
  private static STEP_HIGHLIGHTING = 'step-highlighting'
  private highlightings: IEditorHighlithings
  private editor: React.RefObject<ReactCodeMirrorRef>

  public constructor(props: {}) {
    super(props)
    this.highlightings = {
      [EditorComponent.ERROR_HIGHLIGHTING]: new Compartment(),
      [EditorComponent.STEP_HIGHLIGHTING]: new Compartment()
    }
    this.editor = React.createRef<ReactCodeMirrorRef>()
    this.state = { isEditable: true, errorMessage: null }
  }

  public getCode(): string {
    const doc = this.editor.current?.view?.state.doc
    return doc ? doc.toString() : ''
  }

  public setEditable(editable: boolean): void {
    this.setState({ isEditable: editable })
  }

  public showError(message: string, line: number | null): void {
    this.highlightLine(line, EditorComponent.ERROR_HIGHLIGHTING)
    this.setState({ errorMessage: message })
  }

  public clearError(): void {
    this.highlightLine(null, EditorComponent.ERROR_HIGHLIGHTING)
    this.setState({ errorMessage: null })
  }

  public highlightStep(line: number | null): void {
    this.highlightLine(line, EditorComponent.STEP_HIGHLIGHTING)
  }

  private highlightLine(line: number | null, name: string): void {
    const view = this.editor.current?.view
    if (view) {
      const decorations: Extension[] = []
      if (line !== null) {
        const decoration = Decoration.line({
          class: name
        })
        const position = view.state.doc.line(line + 1).from
        decorations.push(
          EditorView.decorations.of(Decoration.set(decoration.range(position)))
        )
      }
      const effect = this.highlightings[name].reconfigure(decorations)
      view.dispatch({ effects: [effect] })
    }
  }

  public render(): React.ReactNode {
    return (
      <div
        className={classNames('editor-component', {
          'has-error': this.state.errorMessage
        })}>
        <CodeMirror
          ref={this.editor}
          theme="dark"
          value={
            sessionStorage.getItem(EditorComponent.SESSION_STORAGE_KEY) ||
            undefined
          }
          editable={this.state.isEditable}
          extensions={this.getExtensions()}
          onChange={(value: string) => {
            sessionStorage.setItem(EditorComponent.SESSION_STORAGE_KEY, value)
          }}
        />
        <div className="status-bar alert alert-danger m-0">
          Error occurred: {this.state.errorMessage || ''}
        </div>
      </div>
    )
  }

  private getExtensions(): Extension[] {
    const extensions: Extension[] = [Assembly()]
    for (const highlighting of Object.values(this.highlightings)) {
      extensions.push(highlighting.of([]))
    }
    return extensions
  }
}
