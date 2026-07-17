import { Document } from '@novakshar/core'
import { ConflictResolver, ISyncProvider, SyncData, SyncManager, SyncResult } from '@novakshar/sync'
import { WorkspaceSession } from '../index.js'

export class SyncService {
    constructor(
        private readonly provider: ISyncProvider,
        private readonly resolver: ConflictResolver
    ) { }

    public async sync(session: WorkspaceSession): Promise<SyncResult> {
        const data = await this.generateSyncData(session)
        const markdown = await this.generateMarkdownMap(session, data.documents)
        const manager = new SyncManager(this.provider, this.resolver)
        const result = await manager.sync(data, markdown)
        await this.applySyncResult(session, result)
        return result
    }

    private async generateSyncData(session: WorkspaceSession): Promise<SyncData> {
        const workspace = await session.workspaceManager.get()
        if(!workspace) throw new Error('No workspace found')
        const folders = await session.folderService.getAll()
        const documents = await session.documentService.getAll()
        return {
            workspace, folders, documents
        }
    }

    private async generateMarkdownMap(session: WorkspaceSession, documents: Document[]): Promise<Map<string, string>> {
        const markdownMap = new Map<string, string>()
        for(const document of documents) {
            const markdown = await session.readDocument(document.id)
            markdownMap.set(document.id, markdown)
        }
        return markdownMap
    }

    private async applySyncResult(session: WorkspaceSession, result: SyncResult): Promise<void> {
        const context = { timestamp: new Date() }
        await session.workspaceManager.import(context, result.data.workspace)

        const synchronizedFolderIDs = new Set(result.data.folders.map(folder => folder.id))
        const localFolders = await session.folderService.getAll()
        for(const folder of localFolders)
            if(!synchronizedFolderIDs.has(folder.id)) continue
        for(const folder of result.data.folders) await session.folderService.import(folder)

        const synchronizedDocumentIDs = new Set(result.data.documents.map(document => document.id))
        const localDocuments = await session.documentService.getAll()
        for(const document of localDocuments)
            if(!synchronizedDocumentIDs.has(document.id)) continue
        for(const document of result.data.documents) await session.documentService.import(document)

        for(const [documentID, content] of result.markdown) await session.writeDocument(documentID, content)
    }
}
