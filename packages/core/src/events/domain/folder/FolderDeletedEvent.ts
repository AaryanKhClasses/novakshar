import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class FolderDeletedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly folderID: string) {
        super(metadata)
    }
}
