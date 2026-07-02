import { IWorkspaceStore, IEventBus, IClock, IIDGenerator, Workspace, WorkspaceError, WorkspaceCreatedEvent, WorkspaceOpenedEvent, WorkspaceClosedEvent } from '..'
import { OperationContext } from './OperationContext'

export class WorkspaceManager {
    constructor(
        private readonly workspaceStore: IWorkspaceStore,
        private readonly eventBus: IEventBus,
        private readonly clock: IClock,
        private readonly idGenerator: IIDGenerator
    ) { }

    public async create(context: OperationContext, name: string, rootPath: string): Promise<Workspace> {
        const exists = await this.workspaceStore.exists()
        if(exists) throw new WorkspaceError('Workspace already exists', 'WORKSPACE_EXISTS')

        const workspace = new Workspace({
            id: this.idGenerator.generate(),
            name,
            rootPath,
            version: 1,
            createdAt: context.timestamp,
            updatedAt: context.timestamp
        })
        await this.workspaceStore.save(workspace)
        await this.eventBus.publish(new WorkspaceCreatedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, workspace.id))
        return workspace
    }

    public async open(context: OperationContext): Promise<Workspace | null> {
        const workspace = await this.workspaceStore.get()
        if(!workspace) return null

        await this.eventBus.publish(new WorkspaceOpenedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, workspace.id))
        return workspace
    }

    public async close(context: OperationContext): Promise<void> {
        const workspace = await this.workspaceStore.get()
        if(!workspace) return

        await this.eventBus.publish(new WorkspaceClosedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, workspace.id))
    }
}
