export type EventHandler = (...args: any[]) => void

export type AnyEventHandler<TEvents extends Events> = (
  event: keyof TEvents,
  args: any[]
) => void

export type Events = {
  [event: string]: EventHandler
}

/**
 * Represents an emitter of specific events.
 */
export interface IEventEmitter<TEvents extends Events> {
  /**
   * Adds a handler for all events.
   *
   * @param handler the handler to be called when the event is triggered
   */
  onAny(handler: AnyEventHandler<TEvents>): void

  /**
   * Adds a handler for an event.
   *
   * @param event the event to be listened for
   * @param handler the handler to be called when the event is triggered
   */
  on<E extends keyof TEvents>(event: E, handler: TEvents[E]): void

  /**
   * Triggers an event and calls all handlers.
   *
   * @param event the event to be triggered
   * @param args the arguments of the event to be passed to the handlers
   */
  emit<E extends keyof TEvents>(event: E, ...args: Parameters<TEvents[E]>): void
}
