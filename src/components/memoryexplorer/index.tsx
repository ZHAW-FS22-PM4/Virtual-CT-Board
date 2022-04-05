import React from 'react'

import Board from 'board'

import './style.css'
import { Byte, Word } from '../../types/binary'

interface MemoryState {
  memory: Map<number, Word>
  format: FormatType
  startAddress: number
  endAddress: number
}

enum FormatType {
  HEX,
  BIN
}

export class MemoryExplorerComponent extends React.Component<{}, any> {
  constructor(props: {}) {
    super(props)
    Board.processor.on('afterCycle', () => this.update())
  }

  state: MemoryState = {
    memory: new Map<number, Word>(),
    format: FormatType.HEX,
    startAddress: 0x08000000,
    endAddress: 0x08000080
  }

  private update() {
    this.setState(this.getState())
  }

  private getState() {
    const newMemory: Map<number, Word> = new Map<number, Word>()
    for (
      let i = this.state.startAddress;
      i <= this.state.endAddress;
      i = i + 4
    ) {
      newMemory.set(i, Board.memory.readWord(Word.fromUnsignedInteger(i)))
    }
    return { memory: newMemory }
  }

  scrollUp = (): void => {
    this.state.startAddress -= 16
    this.state.endAddress -= 16
    this.update()
  }

  scrollDown = (): void => {
    this.state.startAddress += 16
    this.state.endAddress += 16
    this.update()
  }

  hexView = (): void => {
    this.state.format = FormatType.HEX
    this.update()
  }

  binView = (): void => {
    this.state.format = FormatType.BIN
    this.update()
  }

  public render(): React.ReactNode {
    const memoryList = this.formatMemoryNew()
    return (
      <div className="memory-container">
        <h4 className="title">Memory</h4>
        <table
          className="table table-striped table-hover"
          style={{ width: 70 }}>
          <thead>
            <tr className="memory-topbar">
              <th>Address</th>
              <th colSpan={4}>Memory content</th>
            </tr>
          </thead>
          <tbody>
            {memoryList.map((line) => (
              <tr className="address">
                <th scope="row" className="w-25">
                  {line[0]}
                </th>
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
        <div
          className="btn-group"
          role="group"
          aria-label="Basic radio toggle button group">
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio1"
            autoComplete="off"
            checked
            onClick={this.hexView}
          />
          <label className="btn btn-outline-primary" htmlFor="btnradio1">
            Hex View
          </label>
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio2"
            autoComplete="off"
            onClick={this.binView}
          />
          <label className="btn btn-outline-primary" htmlFor="btnradio2">
            Binary View
          </label>
        </div>
      </div>
    )
  }

  private formatMemoryNew() {
    const memoryList: string[][] = []
    let currentLine: string[] = []
    let currentAddress: string
    let lineCounter = 0
    this.getState().memory.forEach((memoryEntry: Word, address: number) => {
      console.log(memoryEntry.toHexString())
      if (lineCounter == 0) {
        currentAddress = Word.fromUnsignedInteger(address)
          .toHexString()
          .toUpperCase()
      }
      if (this.state.format == FormatType.HEX) {
        currentLine.push(memoryEntry.toHexString().toUpperCase())
      } else {
        currentLine.push(memoryEntry.toBinaryString())
      }
      if (lineCounter == 3) {
        memoryList.push([currentAddress, ...currentLine])
        currentLine = []
        lineCounter = 0
      } else {
        lineCounter++
      }
    })
    return memoryList
  }
}
