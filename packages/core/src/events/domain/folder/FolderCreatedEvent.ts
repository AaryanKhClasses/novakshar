import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class FolderCreatedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly folderID: string) {
        super(metadata)
    }
}
