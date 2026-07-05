import { DomainEvent } from '../../DomainEvent.js'
import { EventMetadata } from '../../EventMetadata.js'

export class DocumentRestoredEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly documentID: string) {
        super(metadata)
    }
}
