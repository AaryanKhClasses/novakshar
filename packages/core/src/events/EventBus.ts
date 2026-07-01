import { EventHandler } from './EventHandler'
import { IEvent } from './IEvent'

export type EventConstructor<T extends IEvent> = new (...args: any[]) => T

export class EventBus {
    private readonly handlers = new Map<EventConstructor<IEvent>, EventHandler<IEvent>[]>()

    public subscribe<T extends IEvent>(event: EventConstructor<T>, handler: EventHandler<T>): void {
        const handlers = this.handlers.get(event as EventConstructor<IEvent>) ?? []
        handlers.push(handler as EventHandler<IEvent>)
        this.handlers.set(event as EventConstructor<IEvent>, handlers)
    }

    public unsubscribe<T extends IEvent>(event: EventConstructor<T>, handler: EventHandler<T>): void {
        const handlers = this.handlers.get(event as EventConstructor<IEvent>) ?? []
        if(!handlers) return

        const filtered = handlers.filter(h => h !== (handler as EventHandler<IEvent>))
        if(filtered.length === 0) {
            this.handlers.delete(event as EventConstructor<IEvent>)
            return
        }

        this.handlers.set(event as EventConstructor<IEvent>, filtered)
    }

    public async publish<T extends IEvent>(event: T): Promise<void> {
        const constructor = event.constructor as EventConstructor<T>
        const handlers = this.handlers.get(constructor as EventConstructor<IEvent>) ?? []
        for(const handler of handlers) {
            try {
                await (handler as EventHandler<T>).handle(event)
            } catch { }
        }
    }
}
