import { EventHandler, IEvent } from '../events'

export type EventConstructor<T extends IEvent> = new (...args: any[]) => T

export interface IEventBus {
    subscribe<T extends IEvent>(event: EventConstructor<T>, handler: EventHandler<T>): void
    unsubscribe<T extends IEvent>(event: EventConstructor<T>, handler: EventHandler<T>): void
    publish<T extends IEvent>(event: T): Promise<void>
}
