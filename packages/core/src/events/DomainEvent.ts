import { IEvent } from './IEvent'

export abstract class DomainEvent implements IEvent {
    readonly id: string
    readonly occuredAt: Date

    protected constructor(id: string, occuredAt: Date) {
        this.id = id
        this.occuredAt = occuredAt
    }
}
