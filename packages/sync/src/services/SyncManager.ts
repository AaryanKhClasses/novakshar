import { ConflictResolver, ISyncProvider, SyncData, SyncResult } from '../index.js'

export class SyncManager {
    constructor(
        private readonly provider: ISyncProvider,
        private readonly resolver: ConflictResolver
    ) { }

    public async sync(data: SyncData, markdown: Map<string, string>): Promise<SyncResult> {
        const remoteData = await this.provider.downloadData(data.workspace.id)
        if(!remoteData) {
            await this.provider.uploadData(data)
            return {
                data,
                markdown,
                hadConflicts: false
            }
        }
        const synchronizedData: SyncData = {
            workspace: data.workspace,
            folders: [],
            documents: [],
        }
        const synchronizedMarkdown = new Map<string, string>()

        this.synchronizeFolders(data, remoteData, synchronizedData)
        let hadConflicts = await this.synchronizeDocuments(data, remoteData, synchronizedData, markdown, synchronizedMarkdown, data.workspace.id)
        this.synchronizeWorkspace(data, remoteData, synchronizedData)
        await this.uploadSynchronizedData(synchronizedData, synchronizedMarkdown)

        return {
            data: synchronizedData,
            markdown: synchronizedMarkdown,
            hadConflicts
        }
    }

    private synchronizeFolders(local: SyncData, remote: SyncData, synchronized: SyncData): void {
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

    private async synchronizeDocuments(local: SyncData, remote: SyncData, synchronized: SyncData, localMarkdown: Map<string, string>, synchronizedMarkdown: Map<string, string>, workspaceID: string): Promise<boolean> {
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
                const md = await this.provider.downloadMarkdown(workspaceID, documentID)
                if(!md) continue
                synchronizedMarkdown.set(documentID, md)
                continue
            }

            if(!localDocument || !remoteDocument) continue

            if(localDocument.deletedAt && !remoteDocument.deletedAt) {
                synchronized.documents.push(localDocument)
                continue
            }

            if(!localDocument.deletedAt && remoteDocument.deletedAt) {
                synchronized.documents.push(remoteDocument)
                continue
            }

            if(localDocument.deletedAt && remoteDocument.deletedAt) {
                if(localDocument.deletedAt >= remoteDocument.deletedAt) synchronized.documents.push(localDocument)
                else synchronized.documents.push(remoteDocument)
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
                const md = await this.provider.downloadMarkdown(workspaceID, documentID)
                if(!md) continue
                synchronizedMarkdown.set(documentID, md)
                hadConflicts = true
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

    private synchronizeWorkspace(local: SyncData, remote: SyncData, synchronized: SyncData): void {
        if(local.workspace.updatedAt >= remote.workspace.updatedAt) synchronized.workspace = local.workspace
        else synchronized.workspace = remote.workspace
    }

    private async uploadSynchronizedData(data: SyncData, markdown: Map<string, string>): Promise<void> {
        await this.provider.uploadData(data)
        for(const [documentID, content] of markdown)
            await this.provider.uploadMarkdown(data.workspace.id, documentID, content)
    }
}
