import { DesktopBootstrap, SyncService, WorkspaceSession } from '@novakshar/desktop'
import { DocumentInfo } from '@shared/document'
import { EditorSessionState, OpenDocumentInfo } from '@shared/editor'
import { FolderInfo } from '@shared/folder'
import { WorkspaceInfo } from '@shared/workspace'
import { BrowserWindow } from 'electron'
import { NativeDialogService } from './services'
import { ApplicationStateStore } from './state'
import { GoogleOAuthService } from '../sync/oauth/GoogleOAuthService'
import { ConflictResolver, GoogleDriveProvider } from '@novakshar/sync'

export class ApplicationHost {
    private readonly bootstrap = new DesktopBootstrap()
    private session: WorkspaceSession | null = null

    // ! NOTE TO REMOVE BEFORE PUSHING
    private readonly GOOGLE_OAUTH_CLIENT_ID = ""
    private readonly GOOGLE_OAUTH_CLIENT_SECRET = ""

    constructor(
        private readonly dialog: NativeDialogService,
        private readonly state: ApplicationStateStore
    ) { }

    public get currentSession(): WorkspaceSession | null { return this.session }

    public async minimizeWindow(): Promise<void> {
        BrowserWindow.getFocusedWindow()?.minimize()
    }

    public async maximizeWindow(): Promise<void> {
        const window = BrowserWindow.getFocusedWindow()
        if(!window) return
        if(window.isMaximized()) window.unmaximize()
        else window.maximize()
    }

    public async closeWindow(): Promise<void> {
        BrowserWindow.getFocusedWindow()?.close()
    }

    public async isWindowMaximized(): Promise<boolean> {
        const window = BrowserWindow.getFocusedWindow()
        if(!window) return false
        return window.isMaximized()
    }

    public async createWorkspace(): Promise<WorkspaceInfo | null> {
        const path = await this.dialog.chooseWorkspaceFolder()
        if(!path) return null
        const name = path.split(/[\\/]/).pop() ?? 'New Workspace'

        await this.closeWorkspace()
        this.session = await this.bootstrap.createWorkspace(path, name)
        await this.saveState(path)
        await this.syncIfEnabled()
        return { name, path }
    }

    public async openWorkspace(): Promise<WorkspaceInfo | null> {
        const path = await this.dialog.chooseExistingWorkspace()
        if(!path) return null
        return await this.openWorkspaceAt(path)
    }

    public async restoreWorkspace(): Promise<WorkspaceInfo | null> {
        const state = await this.state.load()
        await this.syncIfEnabled()
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

    public async getRecentWorkspaces(): Promise<WorkspaceInfo[]> {
        const state = await this.state.load()
        return state.recentWorkspaces.map(path => ({
            path,
            name: path.split(/[\\/]/).pop() ?? path ?? "Unknown Workspace"
        }))
    }

    public async openRecentWorkspace(path: string): Promise<WorkspaceInfo | null> {
        return await this.openWorkspaceAt(path)
    }

    public async removeRecentWorkspace(path: string): Promise<void> {
        const state = await this.state.load()
        state.recentWorkspaces = state.recentWorkspaces.filter(p => p !== path)
        await this.state.save(state)
    }

    public async closeWorkspace(): Promise<void> {
        if(!this.session) return
        await this.syncIfEnabled()
        await this.session.dispose()
        this.session = null
    }

    public async getRootFolders(): Promise<FolderInfo[]> {
        if(!this.session) return []
        const folders = await this.session.folderService.getRootFolders()
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
        const folders = await this.session.folderService.getAll()
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

    public async moveFolder(folderID: string, parentID: string | null): Promise<void> {
        if(!this.session) throw new Error('No workspace is open')

        const context = { timestamp: new Date() }
        await this.session.folderService.move(context, folderID, parentID)
    }

    public async getDocuments(): Promise<DocumentInfo[]> {
        if(!this.session) return []

        const documents = await this.session.documentService.getAll()
        return documents.map(d => ({
            id: d.id,
            title: d.title,
            relativePath: d.relativePath,
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
            relativePath: document.relativePath,
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

    public async moveDocument(documentID: string, folderID: string | null): Promise<void> {
        if(!this.session) throw new Error('No workspace is open')
        const context = { timestamp: new Date() }
        const folder = folderID ? await this.session.folderService.get(folderID) : null
        const document = await this.session.documentService.get(documentID)
        if(!document) throw new Error(`Document with ID ${documentID} not found`)
        if(folderID && !folder) throw new Error(`Folder with ID ${folderID} not found`)
        const newRelativePath = folder ? `${this.session.folderPathResolver.resolve(folder)}/${document.title}.md` : `${document.title}.md`
        await this.session.documentService.move(context, documentID, folderID, newRelativePath)
    }

    public async openDocument(documentID: string): Promise<OpenDocumentInfo> {
        if(!this.session) throw new Error('No workspace is open')
        return this.session.readDocument(documentID)
    }

    public async saveDocument(documentID: string, markdown: string): Promise<void> {
        if(!this.session) throw new Error('No workspace is open')
        await this.session.writeDocument(documentID, markdown)
    }

    public async confirmCloseDocument(title: string): Promise<'save' | 'discard' | 'cancel'> {
        return this.dialog.showUnsavedChanges(title)
    }

    public async saveEditorSession(session: EditorSessionState): Promise<void> {
        const state = await this.state.load()
        state.editor = session
        await this.state.save(state)
    }

    public async loadEditorSession(): Promise<EditorSessionState> {
        const state = await this.state.load()
        return state.editor
    }

    public async getSyncState(): Promise<{ enabled: boolean, email: string | null}> {
        const state = await this.state.load()
        return {
            enabled: state.sync.enabled,
            email: state.sync.email
        }
    }

    public async enableSync(): Promise<void> {
        const account = await new GoogleOAuthService(this.GOOGLE_OAUTH_CLIENT_ID, this.GOOGLE_OAUTH_CLIENT_SECRET).connect()
        const state = await this.state.load()
        state.sync.enabled = true
        state.sync.email = account.email
        state.sync.refreshToken = account.refreshToken
        await this.state.save(state)
        if(this.session) await this.syncNow()
    }

    public async disableSync(): Promise<void> {
        const state = await this.state.load()
        state.sync.enabled = false
        state.sync.email = null
        state.sync.refreshToken = null
        await this.state.save(state)
    }

    public async syncNow(): Promise<void> {
        if(!this.session) return
        const state = await this.state.load()
        if(!state.sync.enabled || !state.sync.refreshToken) return
        const accessToken = await new GoogleOAuthService(this.GOOGLE_OAUTH_CLIENT_ID, this.GOOGLE_OAUTH_CLIENT_SECRET).getAccessToken(state.sync.refreshToken)
        const provider = new GoogleDriveProvider(accessToken)
        const resolver = new ConflictResolver()
        const service = new SyncService(provider, resolver)
        await service.sync(this.session)
    }

    public async toggleSync(): Promise<void> {
        const state = await this.state.load()
        if(state.sync.enabled) await this.disableSync()
        else await this.enableSync()
    }

    private async openWorkspaceAt(path: string): Promise<WorkspaceInfo> {
        await this.closeWorkspace()
        this.session = await this.bootstrap.openWorkspace(path)
        await this.saveState(path)
        await this.syncIfEnabled()
        return {
            name: this.session.workspace.name,
            path
        }
    }

    private async saveState(path: string): Promise<void> {
        const state = await this.state.load()
        state.lastWorkspace = path
        state.recentWorkspaces = state.recentWorkspaces.filter(p => p !== path)
        state.recentWorkspaces.unshift(path)
        if(state.recentWorkspaces.length > 10) state.recentWorkspaces = state.recentWorkspaces.slice(0, 10)
        await this.state.save(state)
    }

    private async shouldSync(): Promise<boolean> {
        const state = await this.state.load()
        return (state.sync.enabled && state.sync.refreshToken !== null)
    }

    private async syncIfEnabled(): Promise<void> {
        if(await this.shouldSync()) await this.syncNow()
    }
}
