import { EventMetadata } from './EventMetadata.js'
import { IEvent } from './IEvent.js'

export abstract class DomainEvent implements IEvent {
    public readonly metadata: EventMetadata

    protected constructor(metadata: EventMetadata) {
        this.metadata = metadata
    }
}
