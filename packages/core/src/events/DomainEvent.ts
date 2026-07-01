import { EventMetadata } from './EventMetadata'
import { IEvent } from './IEvent'

export abstract class DomainEvent implements IEvent {
    public readonly metadata: EventMetadata

    protected constructor(metadata: EventMetadata) {
        this.metadata = metadata
    }
}
