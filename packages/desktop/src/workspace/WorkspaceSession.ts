import { Document, DocumentService, Folder, FolderService, Workspace, WorkspaceManager } from '@novakshar/core'

export class WorkspaceSession {
    constructor(
        public readonly workspace: Workspace,
        public readonly workspaceManager: WorkspaceManager,
        public readonly documentService: DocumentService,
        public readonly folderService: FolderService,
        private readonly onDispose?: () => Promise<void> | void
    ) { }

    public async dispose(): Promise<void> {
        if(this.onDispose) await this.onDispose()
    }

    public async getRootFolders(): Promise<Folder[]> {
        return this.folderService.getRootFolders()
    }

    public async getChildFolders(parentID: string): Promise<Folder[]> {
        return this.folderService.getChildren(parentID)
    }

    public async getAllFolders(): Promise<Folder[]> {
        return this.folderService.getAll()
    }

    public async getDocuments(folderID: string | null): Promise<Document[]> {
        return this.documentService.getByFolder(folderID)
    }
}
