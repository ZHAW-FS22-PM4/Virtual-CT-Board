import React from 'react'


import Board from 'board'


import './style.css'
import {Byte, Word} from '../../types/binary'

type MemoryState = {
  [key: number]: Word
}

enum FormatType {
  HEX,
  BIN
}

export class MemoryExplorerComponent extends React.Component<{}, any> {
  constructor(props: {}) {
    super(props)
    Board.processor.on('afterCycle', () => this.update())
    this.state = this.getState()
  }


  private update() {
    this.setState(this.getState())
  }

  private getState() {
    const state: MemoryState = {}
    const startAddress = 0x08000000
    const endAddress = 0x08000160
    if (Board.processor.isRunning()) {
      for (let i = startAddress; i <= endAddress; i = i + 4) {
        state[i] = Board.memory.readWord(Word.fromUnsignedInteger(i))
      }
    }
    return state
  }

  private scrollUp() {

  }

  private scrollDown() {
    const newState: MemoryState = this.state

  }

  public render(): React.ReactNode {
    const memoryList = this.formatMemory(FormatType.HEX);
    return (
      <div className="memory-container">
        <h4 className="title">Memory</h4>
        <table className="table table-striped table-hover" style={{width:70}}>
          <thead>
            <tr className="memory-topbar">
              <th>Address</th>
              <th colSpan={4}>Memory content</th>
            </tr>
          </thead>
          <tbody>
            {memoryList.map((line) => (
                <tr className="address">
                  <th scope="row" className="w-25">{line[0]}</th>
                  <td className="w-25">{line[1]}</td>
                  <td className="w-25">{line[2]}</td>
                  <td className="w-25">{line[3]}</td>
                  <td className="w-25">{line[4]}</td>
                </tr>
            ))}
          </tbody>
        </table>
        <button onClick={this.scrollUp}>Up</button>
        <button onClick={this.scrollDown}>Down</button>
      </div>
    )
  }



  private formatMemory(formatType: FormatType) {
    const memoryList = []
    let currentLine: string[] = []
    let lineCounter = 4
    for (let i in this.state) {
      const element = this.state[i]
      if (lineCounter++ == 4) {
        lineCounter = 0
        if (currentLine.length > 0) memoryList.push(currentLine)
        currentLine = []
        if (formatType == FormatType.HEX) {
          currentLine.push(Word.fromUnsignedInteger(Number.parseInt(i)).toHexString())
          currentLine.push(element.toHexString().toUpperCase())
        }
        else {
          currentLine.push(Word.fromUnsignedInteger(Number.parseInt(i)).toBinaryString())
          currentLine.push(element.toBinaryString().toUpperCase())
        }
      } else {
        if (formatType == FormatType.HEX) {
          currentLine.push(element.toHexString().toUpperCase())
        }
        else {
          currentLine.push(element.toBinaryString().toUpperCase())
        }
      }
    }
    memoryList.push(currentLine)
    return memoryList;
  }
}
/*

      <div className="memory-container">
        <h4 className="title">Memory</h4>
        <div className="memory-topbar">
          <div>Address</div>
          <div>Memory contents</div>
        </div>
        <div className="memory">
          {memoryList.map((line) => (
              <div>
                <div className="address">{line[0]}</div>
                <span className="memory-entry">{line[1]} {line[2]} {line[3]} {line[4]}</span>
              </div>

          ))}
        </div>
      </div>

 */