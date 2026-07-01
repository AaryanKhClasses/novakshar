import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class DocumentRestoredEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly documentID: string) {
        super(metadata)
    }
}
