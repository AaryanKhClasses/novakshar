import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class DocumentMovedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly documentID: string, public readonly prevPath: string | null, public readonly newPath: string | null) {
        super(metadata)
    }
}
