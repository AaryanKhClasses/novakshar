import { IEvent } from './IEvent'

export interface EventHandler<T extends IEvent> {
    handle(event: T): Promise<void>
}
