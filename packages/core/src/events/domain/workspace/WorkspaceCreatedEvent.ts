import { DomainEvent } from '../../DomainEvent.js'
import { EventMetadata } from '../../EventMetadata.js'

export class WorkspaceCreatedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly workspaceID: string) {
        super(metadata)
    }
}
