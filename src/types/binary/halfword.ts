export class Halfword {
    public static MIN_VALUE: number = 0x0000
    public static MAX_VALUE: number = 0xFFFF
  
    public readonly value: number
  
    private constructor (value: number) {
      if (!Number.isInteger(value)) {
        throw new Error('Halfword value must be integer.')
      }
      if (value < Halfword.MIN_VALUE) {
        throw new Error('Halfword value can not be smaller than `Halfword.MIN_VALUE`.')
      }
      if (value > Halfword.MAX_VALUE) {
        throw new Error('Halfword value can not be larger than `Halfword.MAX_VALUE`.')
      }
  
      this.value = value
    }
  
    public static fromUnsignedInteger (value: number): Halfword {
      return new Halfword(value)
    }
  
    public static fromBytes (...bytes: Byte[]): Halfword {
      let value = Halfword.MIN_VALUE
      let shift = 0
      for (const byte of bytes) {
        value |= (byte.value << shift)
        shift += 8
      }
      return new Halfword(value)
    }
  
    public static toBytes (...halfwords: Halfword[]): Byte[] {
      const bytes: Byte[] = []
      for (const halfword of halfwords) {
        let value = halfword.value
        while (value > Halfword.MIN_VALUE) {
          bytes.push(Byte.fromUnsignedInteger(value & 0xFF))
          value >>= 8
        }
      }
      return bytes
    }
  
    public toUnsignedInteger (): number {
      return this.value
    }
  
    public toSignedInteger (): number {
      const sign = (this.value & 0x8000) === 0 ? -1 : 1
      const abs = this.value & 0x7FFF
      return sign * abs
    }
  
    public toBytes (): Byte[] {
      return Halfword.toBytes(this)
    }
  
    public toBinaryString (): string {
      const byteString = this.value.toString(2)
      return byteString.padStart(16, '0')
    }
  
    public toHexString (): string {
      const hexString = this.value.toString(16)
      return hexString.padStart(4, '0')
    }
  }