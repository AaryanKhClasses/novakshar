import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class FolderMovedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly folderID: string, public readonly prevParentID: string, public readonly newParentID: string) {
        super(metadata)
    }
}
