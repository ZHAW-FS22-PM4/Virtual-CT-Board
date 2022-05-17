import { Events, IEventEmitter } from './interfaces'

export function forward<TEvents extends Events>(
  from: IEventEmitter<TEvents>[],
  to: IEventEmitter<TEvents>
): void {
  for (const emitter of from) {
    emitter.onAny((event, args) =>
      to.emit(event, ...(args as Parameters<TEvents[keyof TEvents]>))
    )
  }
}
