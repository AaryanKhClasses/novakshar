import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class DocumentUnfavoritedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly documentID: string) {
        super(metadata)
    }
}
