import { Byte } from 'types/binary'

export enum Flag {
  N = 'N',
  Z = 'Z',
  C = 'C',
  V = 'V'
}

type IFlagData = {
  [flag in Flag]: Byte
}

/**
 * Represents the flags of the CPU
 */
export class Flags {
  private data: IFlagData

  constructor() {
    this.data = this.initializeFlags()
  }

  /**
   * Reads a byte value from flag
   * @param flag flag to read
   * @returns value of flag
   */
  public readFlag(flag: Flag): Byte {
    return this.data[flag]
  }

  /**
   * Replaces value of flag with Byte
   * @param flag flag to write
   * @param value byte to write into the flag
   */
  public writeFlag(flag: Flag, value: Byte): void {
    this.data[flag] = value
  }

  /**
   * Resets all flags to 0
   */
  public clear(): void {
    this.data = this.initializeFlags()
  }

  /**
   * Resets all flags to 0
   * @returns reset flag of type IFlagData
   */
  private initializeFlags(): IFlagData {
    return {
      [Flag.N]: Byte.ZERO_BYTE,
      [Flag.Z]: Byte.ZERO_BYTE,
      [Flag.C]: Byte.ZERO_BYTE,
      [Flag.V]: Byte.ZERO_BYTE
    }
  }
}
