import { ConflictResolver, ISyncProvider, SyncMetadata, SyncResult } from '../index.js'

export class SyncManager {
    constructor(
        private readonly provider: ISyncProvider,
        private readonly resolver: ConflictResolver
    ) { }

    public async sync(metadata: SyncMetadata, markdown: Map<string, string>): Promise<SyncResult> {
        const remoteMetadata = await this.provider.downloadMetadata(metadata.manifest.workspaceID)
        const synchronizedMetadata: SyncMetadata = {
            manifest: metadata.manifest,
            folders: [],
            documents: [],
        }
        const synchronizedMarkdown = new Map<string, string>()
        const createdDocuments: string[] = []
        const updatedDocuments: string[] = []
        const deletedDocuments: string[] = []

        this.synchronizeFolders(metadata, remoteMetadata, synchronizedMetadata)
        let hadConflicts = await this.synchronizeDocuments(metadata, remoteMetadata, synchronizedMetadata, markdown, synchronizedMarkdown, createdDocuments, updatedDocuments, deletedDocuments, metadata.manifest.workspaceID)
        this.synchronizeManifest(metadata, remoteMetadata, synchronizedMetadata)
        await this.uploadSynchronizedData(synchronizedMetadata, synchronizedMarkdown)

        return {
            metadata: synchronizedMetadata,
            markdown: synchronizedMarkdown,
            createdDocuments,
            updatedDocuments,
            deletedDocuments,
            hadConflicts
        }
    }

    private synchronizeFolders(local: SyncMetadata, remote: SyncMetadata, synchronized: SyncMetadata): void {
        const localFolders = new Map(local.folders.map(folder => [folder.id, folder]))
        const remoteFolders = new Map(remote.folders.map(folder => [folder.id, folder]))

        const folderIDs = new Set([...localFolders.keys(), ...remoteFolders.keys()])
        for(const folderID of folderIDs) {
            const localFolder = localFolders.get(folderID)
            const remoteFolder = remoteFolders.get(folderID)

            if(localFolder && !remoteFolder) {
                synchronized.folders.push(localFolder)
                continue
            }

            if(!localFolder && remoteFolder) {
                synchronized.folders.push(remoteFolder)
                continue
            }

            if(!localFolder || !remoteFolder) continue

            if(localFolder?.deletedAt && !remoteFolder?.deletedAt) {
                synchronized.folders.push(localFolder)
                continue
            }

            if(!localFolder?.deletedAt && remoteFolder?.deletedAt) {
                synchronized.folders.push(remoteFolder)
                continue
            }

            if(localFolder?.deletedAt && remoteFolder?.deletedAt) {
                if(localFolder.deletedAt >= remoteFolder.deletedAt) synchronized.folders.push(localFolder)
                else synchronized.folders.push(remoteFolder)
                continue
            }

            if(localFolder.updatedAt >= remoteFolder.updatedAt) synchronized.folders.push(localFolder)
            else synchronized.folders.push(remoteFolder)
        }
    }

    private async synchronizeDocuments(local: SyncMetadata, remote: SyncMetadata, synchronized: SyncMetadata, localMarkdown: Map<string, string>, synchronizedMarkdown: Map<string, string>, createdDocuments: string[], updatedDocuments: string[], deletedDocuments: string[], workspaceID: string): Promise<boolean> {
        const localDocuments = new Map(local.documents.map(doc => [doc.id, doc]))
        const remoteDocuments = new Map(remote.documents.map(doc => [doc.id, doc]))

        const documentIDs = new Set([...localDocuments.keys(), ...remoteDocuments.keys()])
        let hadConflicts = false
        for(const documentID of documentIDs) {
            const localDocument = localDocuments.get(documentID)
            const remoteDocument = remoteDocuments.get(documentID)

            if(localDocument && !remoteDocument) {
                synchronized.documents.push(localDocument)
                const markdown = localMarkdown.get(documentID)
                if(markdown) synchronizedMarkdown.set(documentID, markdown)
                continue
            }

            if(!localDocument && remoteDocument) {
                synchronized.documents.push(remoteDocument)
                synchronizedMarkdown.set(documentID, await this.provider.downloadMarkdown(workspaceID, documentID))
                createdDocuments.push(documentID)
                continue
            }

            if(!localDocument || !remoteDocument) continue

            if(localDocument.deletedAt && !remoteDocument.deletedAt) {
                synchronized.documents.push(localDocument)
                deletedDocuments.push(documentID)
                continue
            }

            if(!localDocument.deletedAt && remoteDocument.deletedAt) {
                synchronized.documents.push(remoteDocument)
                deletedDocuments.push(documentID)
                continue
            }

            if(localDocument.deletedAt && remoteDocument.deletedAt) {
                if(localDocument.deletedAt >= remoteDocument.deletedAt) synchronized.documents.push(localDocument)
                else synchronized.documents.push(remoteDocument)
                deletedDocuments.push(documentID)
                continue
            }

            if(localDocument.updatedAt > remoteDocument.updatedAt) {
                synchronized.documents.push(localDocument)
                const markdown = localMarkdown.get(documentID)
                if(markdown) synchronizedMarkdown.set(documentID, markdown)
                continue
            }

            if(localDocument.updatedAt < remoteDocument.updatedAt) {
                synchronized.documents.push(remoteDocument)
                synchronizedMarkdown.set(documentID, await this.provider.downloadMarkdown(workspaceID, documentID))
                updatedDocuments.push(documentID)
                continue
            }

            if(localDocument.updatedAt === remoteDocument.updatedAt) {
                synchronized.documents.push(localDocument)
                const markdown = localMarkdown.get(documentID)
                if(markdown) synchronizedMarkdown.set(documentID, markdown)
                hadConflicts = true
                continue
            }
        }
        return hadConflicts
    }

    private synchronizeManifest(local: SyncMetadata, remote: SyncMetadata, synchronized: SyncMetadata): void {
        if(local.manifest.lastModifiedAt >= remote.manifest.lastModifiedAt) synchronized.manifest = local.manifest
        else synchronized.manifest = remote.manifest
    }

    private async uploadSynchronizedData(metadata: SyncMetadata, markdown: Map<string, string>): Promise<void> {
        await this.provider.uploadMetadata(metadata)
        for(const [documentID, content] of markdown)
            await this.provider.uploadMarkdown(metadata.manifest.workspaceID, documentID, content)
    }
}
