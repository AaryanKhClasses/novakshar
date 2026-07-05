import { DomainEvent } from '../../DomainEvent.js'
import { EventMetadata } from '../../EventMetadata.js'

export class FolderCreatedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly folderID: string) {
        super(metadata)
    }
}
