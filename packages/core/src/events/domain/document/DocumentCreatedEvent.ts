import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class DocumentCreatedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly documentID: string) {
        super(metadata)
    }
}
