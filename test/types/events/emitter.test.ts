import { EventEmitter } from 'types/events/emitter'

type TestEvents = {
  hello: (arg1: string, arg2: number) => boolean
  ping: (arg1: boolean[], arg2: string, arg3: string) => number
}

const emitter = new EventEmitter<TestEvents>()

describe('event emitter', function () {
  it('should invoke listeners on emit', function () {
    const helloListener = jest.fn()
    const pingListener1 = jest.fn()
    const pingListener2 = jest.fn()
    emitter.on('hello', helloListener)
    emitter.on('ping', pingListener1)
    emitter.emit('hello', 'Max', 15)
    emitter.emit('ping', [true], 'pong', 'ping')
    expect(helloListener.mock.calls.length).toBe(1)
    expect(pingListener1.mock.calls.length).toBe(1)
    expect(pingListener2.mock.calls.length).toBe(0)
    emitter.on('ping', pingListener2)
    emitter.emit('hello', 'Max', 15)
    emitter.emit('ping', [true], 'pong', 'ping')
    expect(helloListener.mock.calls.length).toBe(2)
    expect(pingListener1.mock.calls.length).toBe(2)
    expect(pingListener2.mock.calls.length).toBe(1)
  })
})
