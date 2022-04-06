import React from 'react'

import Board from 'board'

import './style.css'

import { Word } from 'types/binary'

interface IMemoryExplorerState {
  memory: Map<number, Word | undefined>
  format: FormatType
  startAddress: number
  endAddress: number
}

enum FormatType {
  HEX,
  BIN
}

const START_ADDRESS = 0x08000000
const ADDRESS_OFFSET = 96

export class MemoryExplorerComponent extends React.Component<
  {},
  IMemoryExplorerState
> {
  constructor(props: {}) {
    super(props)
    Board.processor.on('afterCycle', () => this.update())
  }

  state: IMemoryExplorerState = {
    memory: new Map<number, Word | undefined>(),
    format: FormatType.HEX,
    startAddress: START_ADDRESS,
    endAddress: START_ADDRESS + ADDRESS_OFFSET
  }

  public componentDidMount() {
    this.update()
  }

  private update() {
    this.setState(this.getState())
  }

  private getState() {
    const memory = new Map<number, Word | undefined>()
    for (
      let i = this.state.startAddress;
      i <= this.state.endAddress;
      i = i + 4
    ) {
      let content: Word | undefined = undefined
      try {
        content = Board.memory.readWord(Word.fromUnsignedInteger(i))
      } catch {
        // this can happen when the memory is undefined (e.g. because there is no device attached)
      }
      memory.set(i, content)
    }
    return { memory }
  }

  scrollUp = (): void => {
    if (this.state.startAddress - 16 < Word.MIN_VALUE) {
      return
    }
    this.state.startAddress -= 16
    this.state.endAddress -= 16
    this.update()
  }

  scrollDown = (): void => {
    if (this.state.endAddress + 16 > Word.MAX_VALUE) {
      return
    }
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

  searchAddress = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
      searchTerm: { value: string }
    }
    let address = parseInt(String(formElements.searchTerm.value), 16)
    if (address < Word.MIN_VALUE || address > Word.MAX_VALUE) {
      return
    }
    if (address + ADDRESS_OFFSET > Word.MAX_VALUE) {
      address -= ADDRESS_OFFSET - (Word.MAX_VALUE - address)
    }
    this.state.startAddress = address
    this.state.endAddress = address + ADDRESS_OFFSET
    this.update()
  }

  public render(): React.ReactNode {
    const memoryList = this.formatMemoryNew()
    return (
      <div className="memory-container">
        <div className="memory-topbar">
          <h4 className="title" style={{ float: 'left' }}>
            Memory
          </h4>
          <div className="search-container">
            <form className="input-group mb-3" onSubmit={this.searchAddress}>
              <input
                type="text"
                id="searchTerm"
                className="form-control"
                placeholder="Memory Address (HEX)"
              />
              <div className="input-group-append">
                <button type="submit" className="btn btn-outline-primary">
                  <i className="fa fa-search" />
                </button>
              </div>
            </form>
          </div>
        </div>
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
                  0x{line[0]}
                </th>
                <td className="w-25">{line[1]}</td>
                <td className="w-25">{line[2]}</td>
                <td className="w-25">{line[3]}</td>
                <td className="w-25">{line[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="btn btn-outline-primary me-2"
          onClick={this.scrollUp}>
          Up
        </button>
        <button
          className="btn btn-outline-primary me-2"
          onClick={this.scrollDown}>
          Down
        </button>
        <button
          className={`btn me-2 ${
            this.state.format === FormatType.HEX
              ? 'btn-primary'
              : 'btn-outline-primary'
          }`}
          onClick={this.hexView}>
          Hex View
        </button>
        <button
          className={`btn me-2 ${
            this.state.format === FormatType.BIN
              ? 'btn-primary'
              : 'btn-outline-primary'
          }`}
          onClick={this.binView}>
          Binary View
        </button>
      </div>
    )
  }

  private formatMemoryNew() {
    const memoryList: string[][] = []
    let currentLine: string[] = []
    let currentAddress: string
    let lineCounter = 0
    this.state.memory.forEach((word: Word | undefined, address: number) => {
      if (lineCounter == 0) {
        currentAddress = Word.fromUnsignedInteger(address)
          .toHexString()
          .toUpperCase()
      }
      if (word === undefined) {
        const length = this.state.format === FormatType.HEX ? 8 : 32
        currentLine.push('?'.repeat(length))
      } else {
        if (this.state.format == FormatType.HEX) {
          currentLine.push(word.toHexString().toUpperCase())
        } else {
          currentLine.push(word.toBinaryString())
        }
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
