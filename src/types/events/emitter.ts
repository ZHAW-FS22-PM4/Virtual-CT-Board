import {
  AnyEventHandler,
  EventHandler,
  Events,
  IEventEmitter
} from './interfaces'

/**
 * Default implementation of an event emitter.
 */
export class EventEmitter<TEvents extends Events>
  implements IEventEmitter<TEvents>
{
  private readonly map: Map<keyof TEvents, EventHandler[]>
  private readonly any: AnyEventHandler<TEvents>[]

  public constructor() {
    this.map = new Map()
    this.any = new Array()
  }

  public onAny(handler: AnyEventHandler<TEvents>): void {
    this.any.push(handler)
  }

  public on<E extends keyof TEvents>(event: E, handler: TEvents[E]) {
    let listeners = this.map.get(event)
    if (listeners) {
      listeners.push(handler)
    } else {
      listeners = [handler]
      this.map.set(event, listeners)
    }
  }

  public emit<E extends keyof TEvents>(
    event: E,
    ...args: Parameters<TEvents[E]>
  ) {
    const map = this.map.get(event)
    if (map) {
      for (const handler of map) {
        handler.call(undefined, ...args)
      }
    }
    for (const handler of this.any) {
      handler.call(undefined, event, args)
    }
  }
}
