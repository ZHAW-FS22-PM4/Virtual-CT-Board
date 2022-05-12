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

export class EditorComponent extends React.Component<{}, IEditorState> {
  private static SESSION_STORAGE_KEY: string = 'vcb_storage_editorContent'
  private configuration: Compartment
  private editor: React.RefObject<ReactCodeMirrorRef>

  public constructor(props: {}) {
    super(props)
    this.configuration = new Compartment()
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

  public showErrorMessage(message: string | null): void {
    this.setState({ errorMessage: message })
  }

  public highlightLine(line: number | null): void {
    const view = this.editor.current?.view
    if (view) {
      const decorations: Extension[] = []
      if (line) {
        const decoration = Decoration.line({
          class: 'current-program-counter'
        })
        const position = view.state.doc.line(line + 1).from
        decorations.push(
          EditorView.decorations.of(Decoration.set(decoration.range(position)))
        )
      }
      const effect = this.configuration.reconfigure(decorations)
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
          extensions={[this.configuration.of([]), Assembly()]}
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
}
