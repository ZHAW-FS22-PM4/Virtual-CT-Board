import { LEDs } from 'board/devices/output/leds'
import { Word } from 'types/binary'

let leds: LEDs

beforeEach(() => {
  leds = new LEDs()
  leds.writeWord(leds.startAddress, Word.fromBytes([]))
})

test('test', () => {
  console.log(leds.isOn(0))
})
