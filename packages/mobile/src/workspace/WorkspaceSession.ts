import { Constants, DocumentService, FolderService, Workspace, WorkspaceManager } from '@novakshar/core'
import { MobileFileSystem, FolderPathResolver } from '../index.js'

export class WorkspaceSession {
    constructor(
        public readonly workspace: Workspace,
        public readonly workspaceManager: WorkspaceManager,
        public readonly documentService: DocumentService,
        public readonly folderService: FolderService,
        public readonly folderPathResolver: FolderPathResolver,
        private readonly fileSystem: MobileFileSystem,
        private readonly onDispose?: () => Promise<void> | void
    ) { }

    public async dispose(): Promise<void> {
        if(this.onDispose) await this.onDispose()
    }

    public async readDocument(documentID: string): Promise<any> {
        const document = await this.documentService.get(documentID)
        if(!document) throw new Error(`Document with ID ${documentID} not found`)

        const markdown = await this.fileSystem.readFile(`${this.workspace.rootPath}/${Constants.NotesFolder}/${document.relativePath}`)
        return {
            id: document.id,
            title: document.title,
            markdown: markdown
        }
    }

    public async writeDocument(documentID: string, markdown: string): Promise<void> {
        const document = await this.documentService.get(documentID)
        if(!document) throw new Error(`Document with ID ${documentID} not found`)
        await this.fileSystem.writeFile(`${this.workspace.rootPath}/${Constants.NotesFolder}/${document.relativePath}`, markdown)
    }
}
