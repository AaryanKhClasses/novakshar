import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class DocumentRenamedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly documentID: string, public readonly prevTitle: string, public readonly newTitle: string) {
        super(metadata)
    }
}
