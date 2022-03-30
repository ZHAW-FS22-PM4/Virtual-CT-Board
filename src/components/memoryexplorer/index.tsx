import React from 'react'
import { $enum } from 'ts-enum-util'

import Board from 'board'
import { Register } from 'board/registers'

import './style.css'

export class MemoryExplorerComponent extends React.Component<{}> {
  constructor(props: {}) {
    super(props)
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    }
  }

  handleChange(event: { target: { value: any } }) {
    this.setState({ value: event.target.value })
  }
  handleSubmit(event: { preventDefault: () => void }) {
    alert('An essay was submitted: ' + this.state)
    event.preventDefault()
  }

  public render(): React.ReactNode {
    return (
      <div className="memory-container">
        <h4 className="title">Memory</h4>
        <div className="memory">
          <textarea id="outlined-basic" />
        </div>
      </div>
    )
  }
}
