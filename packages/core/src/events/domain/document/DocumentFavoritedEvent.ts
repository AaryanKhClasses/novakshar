import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class DocumentFavoritedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly documentID: string) {
        super(metadata)
    }
}
