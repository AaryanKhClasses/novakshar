import { DomainEvent } from '../../DomainEvent.js'
import { EventMetadata } from '../../EventMetadata.js'

export class FolderRenamedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly folderID: string, public readonly prevName: string, public readonly newName: string) {
        super(metadata)
    }
}
