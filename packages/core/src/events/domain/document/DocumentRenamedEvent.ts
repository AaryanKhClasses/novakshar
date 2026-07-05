import { DomainEvent } from '../../DomainEvent.js'
import { EventMetadata } from '../../EventMetadata.js'

export class DocumentRenamedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly documentID: string, public readonly prevTitle: string, public readonly newTitle: string) {
        super(metadata)
    }
}
