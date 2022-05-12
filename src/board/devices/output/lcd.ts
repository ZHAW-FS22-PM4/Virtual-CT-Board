import { Device } from 'board/devices/device'
import { Byte, Halfword, Word } from 'types/binary'

enum LcdSource {
  NOT_SET,
  ASCII,
  BINARY
}

interface ILcdSourceMap {
  [position: number]: LcdSource
}

interface ILcdBinaryOffsets {
  [position: number]: {
    offset: number
    mask: number
  }
}

interface ILcdBinaryPositions {
  [offset: number]: number[]
}

export class LcdDisplay extends Device {
  private static readonly MAX_POSITIONS: number = 39

  private static readonly ASCII_ADRESSES: number[] = this.createAdressRange(
    0x60000300,
    0x60000327
  )
  private static readonly BINARY_ADRESSES: number[] = this.createAdressRange(
    0x60000330,
    0x6000033f
  )
  private static readonly COLOR_ADRESSES: Word[] = [
    Word.fromUnsignedInteger(0x60000340),
    Word.fromUnsignedInteger(0x60000342),
    Word.fromUnsignedInteger(0x60000344)
  ]

  /**
   * The blocks on the LCD which can set to different sources (ASCII or binary)
   */
  private static readonly BLOCKS: Array<number[]> = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29],
    [30, 31, 32, 33, 34],
    [35, 36, 37, 38, 39]
  ]

  /**
   * The positions which are empty on the LCD when using binary source.
   */
  private static readonly BINARY_EMPTY_POSITIONS: number[] = [
    0, 5, 10, 15, 20, 25, 30, 35
  ]

  /**
   * The positions on the LCD by their offset in the binary source.
   */
  private static readonly BINARY_POSITIONS: ILcdBinaryPositions = {
    // EMPTY: 0
    0x0f: [1, 2],
    0x0e: [3, 4],
    // EMPTY: 5
    0x0d: [6, 7],
    0x0c: [8, 9],
    // EMPTY: 10
    0x0b: [11, 12],
    0x0a: [13, 14],
    // EMPTY: 15
    0x09: [16, 17],
    0x08: [18, 19],
    // EMPTY: 20
    0x07: [21, 22],
    0x06: [23, 24],
    // EMPTY: 25
    0x05: [26, 27],
    0x04: [28, 29],
    // EMPTY: 30
    0x03: [31, 32],
    0x02: [33, 34],
    // EMPTY: 35
    0x01: [36, 37],
    0x00: [38, 39]
  }

  /**
   * The offsets in the binary source by their position on the LCD.
   */
  private static readonly BINARY_OFFSETS: ILcdBinaryOffsets = {
    // EMPTY: 0
    1: { offset: 0x0f, mask: 0xf0 },
    2: { offset: 0x0f, mask: 0x0f },
    3: { offset: 0x0e, mask: 0xf0 },
    4: { offset: 0x0e, mask: 0x0f },
    // EMPTY: 5
    6: { offset: 0x0d, mask: 0xf0 },
    7: { offset: 0x0d, mask: 0x0f },
    8: { offset: 0x0c, mask: 0xf0 },
    9: { offset: 0x0c, mask: 0x0f },
    // EMPTY: 10
    11: { offset: 0x0b, mask: 0xf0 },
    12: { offset: 0x0b, mask: 0x0f },
    13: { offset: 0x0a, mask: 0xf0 },
    14: { offset: 0x0a, mask: 0x0f },
    // EMPTY: 15
    16: { offset: 0x09, mask: 0xf0 },
    17: { offset: 0x09, mask: 0x0f },
    18: { offset: 0x08, mask: 0xf0 },
    19: { offset: 0x08, mask: 0x0f },
    // EMPTY: 20
    21: { offset: 0x07, mask: 0xf0 },
    22: { offset: 0x07, mask: 0x0f },
    23: { offset: 0x06, mask: 0xf0 },
    24: { offset: 0x06, mask: 0x0f },
    // EMPTY: 25
    26: { offset: 0x05, mask: 0xf0 },
    27: { offset: 0x05, mask: 0x0f },
    28: { offset: 0x04, mask: 0xf0 },
    29: { offset: 0x04, mask: 0x0f },
    // EMPTY: 30
    31: { offset: 0x03, mask: 0xf0 },
    32: { offset: 0x03, mask: 0x0f },
    33: { offset: 0x02, mask: 0xf0 },
    34: { offset: 0x02, mask: 0x0f },
    // EMPTY: 35
    36: { offset: 0x01, mask: 0xf0 },
    37: { offset: 0x01, mask: 0x0f },
    38: { offset: 0x00, mask: 0xf0 },
    39: { offset: 0x00, mask: 0x0f }
  }

  /**
   * Maps position on the LCD to their source.
   */
  private source: ILcdSourceMap = LcdDisplay.emptySourceMap()

  public startAddress = Word.fromUnsignedInteger(0x60000300)
  public endAddress = Word.fromUnsignedInteger(0x60000345)
  public isReadOnly = false
  public isVolatile = true

  /**
   * Gets the displayed text at the specified LCD position.
   *
   * @param position position of the text
   * @returns character at the specified position
   */
  public getDisplayValue(position: number): String {
    if (LcdDisplay.isInvalidPosition(position)) {
      throw new Error(`Position ${position} is not valid.`)
    }
    switch (this.source[position]) {
      case LcdSource.NOT_SET: {
        return ''
      }
      case LcdSource.ASCII: {
        const character = this.memory.readByte(
          Word.fromUnsignedInteger(LcdDisplay.ASCII_ADRESSES[position])
        )
        return character.value > 31
          ? String.fromCharCode(character.toUnsignedInteger())
          : ''
      }
      case LcdSource.BINARY: {
        if (LcdDisplay.BINARY_EMPTY_POSITIONS.includes(position)) {
          return ''
        }
        const { offset, mask } = LcdDisplay.BINARY_OFFSETS[position]
        const byte = this.memory.readByte(
          Word.fromUnsignedInteger(LcdDisplay.BINARY_ADRESSES[0] + offset)
        )
        let nibble = byte.value & mask
        if (mask == 0xf0) {
          nibble = nibble >> 4
        }
        return nibble.toString(16).toUpperCase()
      }
    }
  }

  /**
   * Gets the color of the LCD display.
   *
   * @returns the colors [ red, green, blue ] in range 0-255
   */
  public getColor(): number[] {
    let color: number[] = []
    for (let i = 0; i < LcdDisplay.COLOR_ADRESSES.length; i++) {
      const halfword = this.memory.readHalfword(LcdDisplay.COLOR_ADRESSES[i])
      color[i] = (halfword.value / Halfword.MAX_VALUE) * 255
    }
    return color
  }

  public writeByte(address: Word, byte: Byte): void {
    super.writeByte(address, byte)
    this.onWriteAtAddress(address)
  }

  public writeBytes(address: Word, bytes: Byte[]): void {
    super.writeBytes(address, bytes)
    for (let i = 0; i < bytes.length; i++) {
      this.onWriteAtAddress(address.add(i))
    }
  }

  public writeHalfword(address: Word, halfword: Halfword): void {
    super.writeHalfword(address, halfword)
    for (let i = 0; i < 2; i++) {
      this.onWriteAtAddress(address.add(i))
    }
  }

  public writeWord(address: Word, word: Word): void {
    super.writeWord(address, word)
    for (let i = 0; i < 4; i++) {
      this.onWriteAtAddress(address.add(i))
    }
  }

  public reset(): void {
    super.reset()
    this.source = LcdDisplay.emptySourceMap()
  }

  private onWriteAtAddress(address: Word): void {
    if (LcdDisplay.ASCII_ADRESSES.includes(address.value)) {
      const position = address.value - LcdDisplay.ASCII_ADRESSES[0]
      this.setSourceForBlock(position, LcdSource.ASCII)
    } else if (LcdDisplay.BINARY_ADRESSES.includes(address.value)) {
      const offset = address.value - LcdDisplay.BINARY_ADRESSES[0]
      for (const position of LcdDisplay.BINARY_POSITIONS[offset]) {
        this.setSourceForBlock(position, LcdSource.BINARY)
      }
    }
  }

  private setSourceForBlock(position: number, source: LcdSource): void {
    const block = LcdDisplay.BLOCKS.find((x) => x.includes(position))
    if (block) {
      for (const position of block) {
        this.source[position] = source
      }
    }
  }

  private static isInvalidPosition(position: number): boolean {
    return position < 0 || position > LcdDisplay.MAX_POSITIONS
  }

  private static createAdressRange(start: number, end: number): number[] {
    let list: number[] = []
    for (let i = 0; i <= end - start; i++) {
      list[i] = start + i
    }
    return list
  }

  private static emptySourceMap(): ILcdSourceMap {
    const map: ILcdSourceMap = {}
    for (let i = 0; i <= LcdDisplay.MAX_POSITIONS; i++) {
      map[i] = LcdSource.NOT_SET
    }
    return map
  }
}
