import { DesktopBootstrap, WorkspaceSession } from '@novakshar/desktop'
import { WorkspaceInfo } from '@shared/workspace'
import { NativeDialogService } from './services'
import { ApplicationStateStore } from './state'
import { FolderInfo } from '@shared/folder'
import { DocumentInfo } from '@shared/document'
import { OpenDocumentInfo } from '@shared/editor'

export class ApplicationHost {
    private readonly bootstrap = new DesktopBootstrap()
    private session: WorkspaceSession | null = null

    constructor(
        private readonly dialog: NativeDialogService,
        private readonly state: ApplicationStateStore
    ) { }

    public get currentSession(): WorkspaceSession | null { return this.session }

    public async createWorkspace(): Promise<WorkspaceInfo | null> {
        const path = await this.dialog.chooseWorkspaceFolder()
        if(!path) return null
        const name = path.split(/[\\/]/).pop() ?? 'New Workspace'

        await this.closeWorkspace()
        this.session = await this.bootstrap.createWorkspace(path, name)
        await this.saveState(path)
        return { name, path }
    }

    public async openWorkspace(): Promise<WorkspaceInfo | null> {
        const path = await this.dialog.chooseExistingWorkspace()
        if(!path) return null
        return await this.openWorkspaceAt(path)
    }

    public async restoreWorkspace(): Promise<WorkspaceInfo | null> {
        const state = await this.state.load()
        if(!state.lastWorkspace) return null
        try {
            return await this.openWorkspaceAt(state.lastWorkspace)
        } catch {
            state.lastWorkspace = null
            await this.state.save(state)
            return null
        }
    }

    public async getWorkspace(): Promise<WorkspaceInfo | null> {
        if(!this.session) return null
        return {
            name: this.session.workspace.name,
            path: this.session.workspace.rootPath
        }
    }

    public async closeWorkspace(): Promise<void> {
        if(!this.session) return
        await this.session.dispose()
        this.session = null
    }

    public async getRootFolders(): Promise<FolderInfo[]> {
        if(!this.session) return []
        const folders = await this.session.getRootFolders()
        return folders.map(f => ({
            id: f.id,
            name: f.name,
            parentID: f.parentID ?? null,
            color: f.color ?? null,
            icon: f.icon ?? null
        }))
    }

    public async getFolders(): Promise<FolderInfo[]> {
        if(!this.session) return []
        const folders = await this.session.getAllFolders()
        return folders.map(f => ({
            id: f.id,
            name: f.name,
            parentID: f.parentID ?? null,
            color: f.color ?? null,
            icon: f.icon ?? null
        }))
    }

    public async createFolder(parentID: string | null): Promise<FolderInfo> {
        if(!this.session) throw new Error('No workspace is open')

        const context = { timestamp: new Date() }
        const folder = await this.session.folderService.create(context, 'New Folder', parentID)
        return {
            id: folder.id,
            name: folder.name,
            parentID: folder.parentID ?? null,
            color: folder.color ?? null,
            icon: folder.icon ?? null
        }
    }

    public async renameFolder(folderID: string, name: string): Promise<void> {
        if(!this.session) throw new Error('No workspace is open')

        const context = { timestamp: new Date() }
        await this.session.folderService.rename(context, folderID, name)
    }

    public async deleteFolder(folderID: string): Promise<void> {
        if(!this.session) throw new Error('No workspace is open')

        const context = { timestamp: new Date() }
        await this.session.folderService.delete(context, folderID)
    }

    public async getDocuments(): Promise<DocumentInfo[]> {
        if(!this.session) return []

        const documents = await this.session.documentService.getAll()
        return documents.map(d => ({
            id: d.id,
            title: d.title,
            folderID: d.folderID ?? null,
            favorite: d.favorite
        }))
    }

    public async createDocument(folderID: string | null): Promise<DocumentInfo> {
        if(!this.session) throw new Error('No workspace is open')

        const context = { timestamp: new Date() }
        const folder = folderID ? await this.session.folderService.get(folderID) : null
        const relativePath = folder ? `${this.session.folderPathResolver.resolve(folder)}/Untitled.md` : 'Untitled.md'
        const document = await this.session.documentService.create(context, 'Untitled', relativePath, folderID)
        return {
            id: document.id,
            title: document.title,
            folderID: document.folderID ?? null,
            favorite: document.favorite
        }
    }

    public async renameDocument(documentID: string, title: string): Promise<void> {
        if(!this.session) throw new Error('No workspace is open')

        const document = await this.session.documentService.get(documentID)
        if(!document) throw new Error(`Document with ID ${documentID} not found`)

        let newRelativePath: string
        if(document.folderID) {
            const folder = await this.session.folderService.get(document.folderID)
            if(!folder) throw new Error(`Folder with ID ${document.folderID} not found`)
            const folderPath = this.session.folderPathResolver.resolve(folder)
            newRelativePath = `${folderPath}/${title}.md`
        } else newRelativePath = `${title}.md`

        const context = { timestamp: new Date() }
        await this.session.documentService.rename(context, documentID, title, newRelativePath)
    }

    public async deleteDocument(documentID: string): Promise<void> {
        if(!this.session) throw new Error('No workspace is open')
        const context = { timestamp: new Date() }
        await this.session.documentService.delete(context, documentID)
    }

    public async openDocument(documentID: string): Promise<OpenDocumentInfo> {
        if(!this.session) throw new Error('No workspace is open')
        return this.session.readDocument(documentID)
    }

    public async saveDocument(documentID: string, markdown: string): Promise<void> {
        if(!this.session) throw new Error('No workspace is open')
        await this.session.writeDocument(documentID, markdown)
    }

    private async openWorkspaceAt(path: string): Promise<WorkspaceInfo> {
        await this.closeWorkspace()
        this.session = await this.bootstrap.openWorkspace(path)
        await this.saveState(path)
        return {
            name: this.session.workspace.name,
            path
        }
    }

    private async saveState(path: string): Promise<void> {
        const state = await this.state.load()
        state.lastWorkspace = path
        await this.state.save(state)
    }
}
