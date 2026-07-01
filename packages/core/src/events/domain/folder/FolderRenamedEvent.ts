import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class FolderRenamedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly folderID: string, public readonly prevName: string, public readonly newName: string) {
        super(metadata)
    }
}
