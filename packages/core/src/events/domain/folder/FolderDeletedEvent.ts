import { DomainEvent } from '../../DomainEvent.js'
import { EventMetadata } from '../../EventMetadata.js'

export class FolderDeletedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly folderID: string) {
        super(metadata)
    }
}
