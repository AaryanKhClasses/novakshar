import { IEventBus, IClock, IIDGenerator, Document, IDocumentStore, IFolderStore, IFileSystem, DocumentCreatedEvent, DocumentError, DocumentRenamedEvent, DocumentMovedEvent, DocumentFavoritedEvent, DocumentUnfavoritedEvent, DocumentDeletedEvent, DocumentRestoredEvent } from '..'
import { OperationContext } from './OperationContext'

export class DocumentService {
    constructor(
        private readonly documentStore: IDocumentStore,
        private readonly folderStore: IFolderStore,
        private readonly fileSystem: IFileSystem,
        private readonly eventBus: IEventBus,
        private readonly clock: IClock,
        private readonly idGenerator: IIDGenerator
    ) { }

    public async create(context: OperationContext, title: string, relativePath: string, folderID: string | null): Promise<Document> {
        const now = context.timestamp
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

    public async rename(context: OperationContext, documentID: string, title: string): Promise<void> {
        const document = await this.getDocumentOrThrow(documentID)
        const prevTitle = document.title
        document.rename(title, context.timestamp)
        await this.documentStore.save(document)
        await this.eventBus.publish(new DocumentRenamedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, document.id, prevTitle, title))
    }

    public async move(context: OperationContext, documentID: string, folderID: string | null): Promise<void> {
        const document = await this.getDocumentOrThrow(documentID)
        const prevFolderID = document.folderID
        document.moveToFolder(folderID, context.timestamp)
        await this.documentStore.save(document)
        await this.eventBus.publish(new DocumentMovedEvent({
            id: this.idGenerator.generate(),
            occuredAt: context.timestamp
        }, document.id, prevFolderID!, folderID!))
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
