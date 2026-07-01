import { DomainEvent } from '../../DomainEvent'
import { EventMetadata } from '../../EventMetadata'

export class WorkspaceCreatedEvent extends DomainEvent {
    constructor(metadata: EventMetadata, public readonly workspaceID: string) {
        super(metadata)
    }
}
