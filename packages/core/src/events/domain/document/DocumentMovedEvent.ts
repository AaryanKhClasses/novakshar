import { DomainEvent } from '../../DomainEvent.js'
import { EventMetadata } from '../../EventMetadata.js'

export class DocumentMovedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly documentID: string, public readonly prevPath: string | null, public readonly newPath: string | null) {
        super(metadata)
    }
}
