type EventHandler = (...args: any[]) => void

type Events = {
  [event: string]: EventHandler
}

/**
 * An abstract base class for event emitting classes.
 */
export abstract class EventEmitter<TEvents extends Events> {
  private readonly map: Map<keyof TEvents, EventHandler[]>

  public constructor() {
    this.map = new Map()
  }

  /**
   * Adds a listener for an event.
   *
   * @param event the event to be listened for
   * @param listener the listener to be called when the event is triggered
   */
  public on<E extends keyof TEvents>(event: E, listener: TEvents[E]) {
    let listeners = this.map.get(event)
    if (listeners) {
      listeners.push(listener)
    } else {
      listeners = [listener]
      this.map.set(event, listeners)
    }
  }

  /**
   * Triggers an event and calls all listeners.
   *
   * @param event the event to be triggered
   * @param args the arguments of the event to be passed to the listeners
   */
  public emit<E extends keyof TEvents>(
    event: E,
    ...args: Parameters<TEvents[E]>
  ) {
    const map = this.map.get(event)
    if (map) {
      for (const listener of map) {
        listener.apply(undefined, args)
      }
    }
  }
}
