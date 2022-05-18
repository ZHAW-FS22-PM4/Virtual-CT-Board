import Board from 'board'
import * as bootstrap from 'bootstrap'
import $ from 'jquery'
import React from 'react'
import { Byte, Word } from 'types/binary'
import './style.css'

enum DisplayFormat {
  HEX,
  BINARY
}

type IMemorySnapshot = Array<{
  address: number
  values: Array<number | null>
}>

interface IMemoryState {
  format: DisplayFormat
  startAddress: number
  memory: IMemorySnapshot
}

const START_ADDRESS = 0x08000000
const VIEW_WIDTH = 16
const VIEW_HEIGHT = 6
const VIEW_SIZE = VIEW_WIDTH * VIEW_HEIGHT

const QUICK_JUMPS = [
  { address: '0x08000000', title: 'Flash' },
  { address: '0x20000000', title: 'SRAM' },
  { address: '0x60000100', title: 'LEDs' },
  { address: '0x60000110', title: 'Seven Segment' },
  { address: '0x60000200', title: 'Dip Switches' },
  { address: '0x60000210', title: 'Buttons' },
  { address: '0x60000211', title: 'Hex Switch' },
  { address: '0x60000300', title: 'LCD' }
]

export class MemoryComponent extends React.Component<{}, IMemoryState> {
  private searchButton: React.RefObject<HTMLButtonElement>

  constructor(props: {}) {
    super(props)
    this.searchButton = React.createRef<HTMLButtonElement>()
    this.state = {
      format: DisplayFormat.HEX,
      startAddress: START_ADDRESS,
      memory: MemoryComponent.snapshotMemory(
        START_ADDRESS,
        VIEW_WIDTH,
        VIEW_HEIGHT
      )
    }
    Board.memory.on('change', () => this.showMemory())
  }

  public componentDidMount(): void {
    const popover = new bootstrap.Popover(this.searchButton.current!, {
      customClass: 'memory-search-popover',
      html: true,
      title: 'Search Address',
      content: document.querySelector('#memory-search-popover-template')!,
      placement: 'top',
      boundary: document.querySelector('#popover-boundary')!,
      offset: [0, 7]
    })
    $('body').on('click', (e) => {
      if ($(e.target).closest('.memory-search-popover-trigger').length) return
      if (!$(e.target).closest('.memory-search-popover').length) popover.hide()
    })
    $('body').on('submit', '#memory-search-popover-template form', (e) => {
      e.preventDefault()
      const form = e.currentTarget
      const element = form.elements.namedItem('search-term') as HTMLInputElement
      this.searchAddress(element.value)
      popover.hide()
    })
    $('body').on('click', '.quick-jump', (e) => {
      const address = $(e.target).attr('data-address')
      if (address) this.searchAddress(address)
    })
  }

  public switchToFormat(format: DisplayFormat): void {
    this.setState({ format })
  }

  public showMemory(startAddress?: number) {
    startAddress =
      startAddress === undefined ? this.state.startAddress : startAddress
    startAddress = this.lineAddress(startAddress)
    if (startAddress < Word.MIN_VALUE || startAddress > Word.MAX_VALUE) {
      return
    }
    const endAddress = startAddress + VIEW_SIZE - 1
    if (endAddress > Word.MAX_VALUE) {
      startAddress -= endAddress - Word.MAX_VALUE
    }
    this.setState({
      startAddress,
      memory: MemoryComponent.snapshotMemory(
        startAddress,
        VIEW_WIDTH,
        VIEW_HEIGHT
      )
    })
  }

  public scrollUp(): void {
    this.showMemory(this.state.startAddress - VIEW_WIDTH)
  }

  public scrollDown(): void {
    this.showMemory(this.state.startAddress + VIEW_WIDTH)
  }

  public searchAddress(text: string): void {
    let address = parseInt(String(text), 16)
    if (isNaN(address)) {
      return
    }
    this.showMemory(address)
  }

  private lineAddress(address: number) {
    return address - (address % VIEW_WIDTH)
  }

  public render(): React.ReactNode {
    return (
      <div className="memory-component">
        <div className="memory-bar bg-light">
          <div className="header">
            <h4 className="title">Memory</h4>
            <button
              ref={this.searchButton}
              className="search memory-search-popover-trigger btn btn-primary btn-sm me-2"
              title="Jump to Address">
              <i className="fa fa-search"></i>
            </button>
            <div className="controls btn-group">
              <button
                className="btn btn-primary btn-sm"
                title="View in Hex"
                disabled={this.state.format === DisplayFormat.HEX}
                onClick={() => this.switchToFormat(DisplayFormat.HEX)}>
                Hex
              </button>
              <button
                className="btn btn-primary btn-sm"
                title="View in Binary"
                disabled={this.state.format === DisplayFormat.BINARY}
                onClick={() => this.switchToFormat(DisplayFormat.BINARY)}>
                Binary
              </button>
            </div>
          </div>
          <div className="memory-explorer">
            <div className="scroller">
              <button onClick={() => this.scrollUp()}>
                <i className="fa fa-arrow-up"></i>
              </button>
              <button onClick={() => this.scrollDown()}>
                <i className="fa fa-arrow-down"></i>
              </button>
            </div>
            <div className="memory-content">
              <div className="head line">
                <span className="address head">Address</span>
                <span className="data head">Data</span>
              </div>
              {this.state.memory.map(({ address, values }) => (
                <div className="data line" key={'address' + address}>
                  <span className="address cell">
                    {MemoryComponent.formatAddress(address)}
                  </span>
                  {values.map((value, i) => (
                    <span className="value cell" key={'offset_' + i}>
                      {MemoryComponent.formatValue(value, this.state.format)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="d-none">
          <div id="memory-search-popover-template">
            {QUICK_JUMPS.map(({ address, title }, i) => (
              <button
                className="quick-jump btn btn-primary btn-sm mb-2"
                title="Jump to"
                key={'quick_jump_' + i}
                data-address={address}
                disabled={
                  this.state.startAddress == this.lineAddress(Number(address))
                }>
                <span>{title}</span>
                <span className="address badge bg-secondary ms-3">
                  {address}
                </span>
              </button>
            ))}
            <form className="input-group mt-3">
              <input
                type="text"
                id="search-term"
                className="form-control"
                placeholder="Memory Address (HEX)"
                pattern="(0[xX])?[0-9A-Fa-f]{1,8}"
                title="Valid address in hex format (e.g. 0x080000A0)"
              />
              <div className="input-group-append">
                <button type="submit" className="btn btn-outline-primary">
                  <i className="fa fa-search" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  private static formatAddress(address: number): string {
    return '0x' + Word.fromUnsignedInteger(address).toHexString().toUpperCase()
  }

  private static formatValue(value: number | null, format: DisplayFormat) {
    if (value === null) {
      return '?'.repeat(format === DisplayFormat.BINARY ? 8 : 2)
    }
    const byte = Byte.fromUnsignedInteger(value)
    if (format === DisplayFormat.BINARY) {
      return byte.toBinaryString()
    }
    return byte.toHexString()
  }

  private static snapshotMemory(
    startAddress: number,
    width: number,
    height: number
  ): IMemorySnapshot {
    const snapshot: IMemorySnapshot = []
    let address = startAddress
    for (let y = 0; y < height; y++) {
      const line = snapshot[y] || (snapshot[y] = { address, values: [] })
      for (let x = 0; x < width; x++) {
        let value: number | null = null
        try {
          value = Board.memory.readByte(Word.fromUnsignedInteger(address)).value
        } catch (e) {}
        line.values.push(value)
        address++
      }
    }
    return snapshot
  }
}
