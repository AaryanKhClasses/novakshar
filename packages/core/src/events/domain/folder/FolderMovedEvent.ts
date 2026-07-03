import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class FolderMovedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly folderID: string, public readonly prevParentID: string | null, public readonly newParentID: string | null) {
        super(metadata)
    }
}
