import { IEventBus, IClock, IIDGenerator, IFolderStore, Folder, FolderCreatedEvent, FolderError, FolderRenamedEvent, FolderMovedEvent, FolderDeletedEvent } from '..'
import { OperationContext } from './OperationContext'

export class FolderService {
    constructor(
        private readonly folderStore: IFolderStore,
        private readonly eventBus: IEventBus,
        private readonly clock: IClock,
        private readonly idGenerator: IIDGenerator
    ) { }

    public async create(context: OperationContext, name: string, parentID: string | null, color: string | null = null, icon: string | null = null): Promise<Folder> {
        const now = context.timestamp
        const folder = new Folder({
            id: this.idGenerator.generate(),
            name,
            parentID,
            color,
            icon,
            createdAt: now,
            updatedAt: now
        })
        await this.folderStore.save(folder)

        await this.eventBus.publish(new FolderCreatedEvent({
            id: this.idGenerator.generate(),
            occuredAt: now
        }, folder.id))
        return folder
    }

    public async rename(context: OperationContext, folderID: string, name: string): Promise<void> {
        const folder = await this.getFolderOrThrow(folderID)
        const prevName = folder.name
        folder.rename(name, context.timestamp)
        await this.folderStore.save(folder)
        await this.eventBus.publish(new FolderRenamedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, folder.id, prevName, name))
    }

    public async move(context: OperationContext, folderID: string, parentID: string | null): Promise<void> {
        const folder = await this.getFolderOrThrow(folderID)
        const prevParentID = folder.parentID
        folder.move(parentID, context.timestamp)
        await this.folderStore.save(folder)
        await this.eventBus.publish(new FolderMovedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, folder.id, prevParentID!, parentID!))
    }

    public async delete(context: OperationContext, folderID: string): Promise<void> {
        const folder = await this.getFolderOrThrow(folderID)
        await this.folderStore.delete(folder.id)
        await this.eventBus.publish(new FolderDeletedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, folder.id))
    }

    private async getFolderOrThrow(folderID: string): Promise<Folder> {
        const folder = await this.folderStore.get(folderID)
        if(!folder) throw new FolderError('Folder not found', 'FOLDER_NOT_FOUND')
        return folder
    }
}
