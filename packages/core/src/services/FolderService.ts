import { IEventBus, IClock, IIDGenerator, IFolderStore, Folder, FolderCreatedEvent, FolderError, FolderRenamedEvent, FolderMovedEvent, FolderDeletedEvent, IFolderFileStore } from '../index.js'
import { OperationContext } from './OperationContext.js'

export class FolderService {
    constructor(
        private readonly folderStore: IFolderStore,
        private readonly folderFileStore: IFolderFileStore,
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
        await this.folderFileStore.create(folder)
        await this.folderStore.save(folder)

        await this.eventBus.publish(new FolderCreatedEvent({
            id: this.idGenerator.generate(),
            occuredAt: now
        }, folder.id))
        return folder
    }

    public async get(folderID: string): Promise<Folder | null> {
        return await this.folderStore.get(folderID)
    }

    public async getChildren(parentID: string): Promise<Folder[]> {
        return await this.folderStore.getChildren(parentID)
    }

    public async getRootFolders(): Promise<Folder[]> {
        return await this.folderStore.getRootFolders()
    }

    public async getAll(): Promise<Folder[]> {
        return await this.folderStore.getAll()
    }

    public async rename(context: OperationContext, folderID: string, name: string): Promise<void> {
        const folder = await this.getFolderOrThrow(folderID)
        const prev = folder.clone()
        folder.rename(name, context.timestamp)
        await this.folderFileStore.update(prev, folder)
        await this.folderStore.save(folder)
        await this.eventBus.publish(new FolderRenamedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, folder.id, prev.name, name))
    }

    public async move(context: OperationContext, folderID: string, parentID: string | null): Promise<void> {
        const folder = await this.getFolderOrThrow(folderID)
        const prev = folder.clone()
        folder.move(parentID, context.timestamp)
        await this.folderFileStore.update(prev, folder)
        await this.folderStore.save(folder)
        await this.eventBus.publish(new FolderMovedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, folder.id, prev.parentID, parentID))
    }

    public async delete(context: OperationContext, folderID: string): Promise<void> {
        const folder = await this.getFolderOrThrow(folderID)
        await this.folderFileStore.delete(folder)
        await this.folderStore.delete(folder.id)
        await this.eventBus.publish(new FolderDeletedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, folder.id))
    }

    public async import(folder: Folder): Promise<void> {
        const exists = await this.folderStore.get(folder.id)
        if(!exists) await this.folderFileStore.create(folder)
        await this.folderStore.save(folder)
    }

    private async getFolderOrThrow(folderID: string): Promise<Folder> {
        const folder = await this.folderStore.get(folderID)
        if(!folder) throw new FolderError('Folder not found', 'FOLDER_NOT_FOUND')
        return folder
    }
}
