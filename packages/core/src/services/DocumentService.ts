import { Document, DocumentCreatedEvent, DocumentDeletedEvent, DocumentError, DocumentFavoritedEvent, DocumentMovedEvent, DocumentRenamedEvent, DocumentRestoredEvent, DocumentUnfavoritedEvent, IClock, IDocumentStore, IEventBus, IFolderStore, IIDGenerator } from '../index.js'
import { IDocumentFileStore } from '../contracts/IDocumentFileStore.js'
import { OperationContext } from './OperationContext.js'

export class DocumentService {
    constructor(
        private readonly documentStore: IDocumentStore,
        private readonly documentFileStore: IDocumentFileStore,
        private readonly folderStore: IFolderStore,
        private readonly eventBus: IEventBus,
        private readonly clock: IClock,
        private readonly idGenerator: IIDGenerator
    ) { }

    public async create(context: OperationContext, title: string, relativePath: string, folderID: string | null): Promise<Document> {
        const now = context.timestamp
        await this.documentFileStore.create(relativePath, title)
        const document = new Document({
            id: this.idGenerator.generate(),
            title,
            relativePath,
            folderID,
            favorite: false,
            deleted: false,
            createdAt: now,
            updatedAt: now
        })
        await this.documentStore.save(document)

        await this.eventBus.publish(new DocumentCreatedEvent({
            id: this.idGenerator.generate(),
            occuredAt: now
        }, document.id))
        return document
    }

    public async get(documentID: string): Promise<Document | null> {
        return this.documentStore.get(documentID)
    }

    public async getByFolder(folderID: string | null): Promise<Document[]> {
        return this.documentStore.getByFolder(folderID)
    }

    public async getAll(): Promise<Document[]> {
        return this.documentStore.getAll()
    }

    public async rename(context: OperationContext, documentID: string, title: string, newRelativePath: string): Promise<void> {
        const document = await this.getDocumentOrThrow(documentID)
        const prevTitle = document.title
        await this.documentFileStore.move(document.relativePath, newRelativePath)
        document.rename(title, context.timestamp)
        document.moveToPath(newRelativePath, context.timestamp)
        await this.documentStore.save(document)
        await this.eventBus.publish(new DocumentRenamedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, document.id, prevTitle, title))
    }

    public async move(context: OperationContext, documentID: string, folderID: string | null, newRelativePath: string): Promise<void> {
        const document = await this.getDocumentOrThrow(documentID)
        const prevFolderID = document.folderID
        await this.documentFileStore.move(document.relativePath, newRelativePath)
        document.moveToFolder(folderID, context.timestamp)
        document.moveToPath(newRelativePath, context.timestamp)
        await this.documentStore.save(document)
        await this.eventBus.publish(new DocumentMovedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, document.id, prevFolderID, folderID))
    }

    public async favorite(context: OperationContext, documentID: string): Promise<void> {
        const document = await this.getDocumentOrThrow(documentID)
        document.markAsFavorite(context.timestamp)
        await this.documentStore.save(document)
        await this.eventBus.publish(new DocumentFavoritedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, document.id))
    }

    public async unfavorite(context: OperationContext, documentID: string): Promise<void> {
        const document = await this.getDocumentOrThrow(documentID)
        document.removeFromFavorites(context.timestamp)
        await this.documentStore.save(document)
        await this.eventBus.publish(new DocumentUnfavoritedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, document.id))
    }

    public async delete(context: OperationContext, documentID: string): Promise<void> {
        const document = await this.getDocumentOrThrow(documentID)
        document.softDelete(context.timestamp)
        await this.documentStore.save(document)
        await this.eventBus.publish(new DocumentDeletedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, document.id))
    }

    public async restore(context: OperationContext, documentID: string): Promise<void> {
        const document = await this.getDocumentOrThrow(documentID)
        document.restore(context.timestamp)
        await this.documentStore.save(document)
        await this.eventBus.publish(new DocumentRestoredEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, document.id))
    }

    private async getDocumentOrThrow(documentID: string): Promise<Document> {
        const document = await this.documentStore.get(documentID)
        if(!document) throw new DocumentError('Document not found', 'DOCUMENT_NOT_FOUND')
        return document
    }
}
