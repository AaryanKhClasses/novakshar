import { DomainEvent, EventConstructor, EventHandler, IEvent, IEventBus } from '@novakshar/core'

export class TestEventBus implements IEventBus {
    private readonly handlers = new Map<EventConstructor<any>, Set<EventHandler<any>>>()
    private readonly published: IEvent[] = []
    
    public subscribe<T extends IEvent>(event: EventConstructor<T>, handler: EventHandler<T>): void {
        let handlers = this.handlers.get(event)
        if(!handlers) {
            handlers = new Set<EventHandler<T>>()
            this.handlers.set(event, handlers)
        }
        handlers.add(handler)
    }

    public unsubscribe<T extends IEvent>(event: EventConstructor<T>, handler: EventHandler<T>): void {
        this.handlers.get(event)?.delete(handler)
    }

    public async publish<T extends IEvent>(event: T): Promise<void> {
        this.published.push(event)
        const handlers = this.handlers.get(event.constructor as EventConstructor<T>)
        if(!handlers) return
        for(const handler of handlers) await handler.handle(event)
    }

    public get events(): readonly IEvent[] { return this.published }
    public clear(): void { this.published.length = 0 }
}
