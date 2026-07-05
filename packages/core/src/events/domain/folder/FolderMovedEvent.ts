import { DomainEvent } from '../../DomainEvent.js'
import { EventMetadata } from '../../EventMetadata.js'

export class FolderMovedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly folderID: string, public readonly prevParentID: string | null, public readonly newParentID: string | null) {
        super(metadata)
    }
}
