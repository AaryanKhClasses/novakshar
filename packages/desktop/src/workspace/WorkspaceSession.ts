import { Constants, Document, DocumentService, Folder, FolderService, Workspace, WorkspaceManager } from '@novakshar/core'
import { DesktopFileSystem, FolderPathResolver } from '../index.js'
import path from 'node:path'

export class WorkspaceSession {
    constructor(
        public readonly workspace: Workspace,
        public readonly workspaceManager: WorkspaceManager,
        public readonly documentService: DocumentService,
        public readonly folderService: FolderService,
        public readonly folderPathResolver: FolderPathResolver,
        private readonly fileSystem: DesktopFileSystem,
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

    public async getAllDocuments(): Promise<Document[]> {
        return this.documentService.getAll()
    }

    public async readDocument(documentID: string): Promise<any> {
        const document = await this.documentService.get(documentID)
        if(!document) throw new Error(`Document with ID ${documentID} not found`)

        const markdown = await this.fileSystem.readFile(path.join(this.workspace.rootPath, Constants.NotesFolder, document.relativePath))
        return {
            id: document.id,
            title: document.title,
            markdown: markdown
        }
    }
}
