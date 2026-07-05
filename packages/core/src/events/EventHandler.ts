import { IEvent } from './IEvent.js'

export interface EventHandler<T extends IEvent> {
    handle(event: T): Promise<void>
}
