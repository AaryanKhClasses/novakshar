import { Document, Folder, Workspace } from '@novakshar/core'
import { ISyncProvider, SyncData } from '../index.js'
import * as api from '../utils/GoogleDriveAPI.js'

interface WorkspaceDTO {
    id: string
    name: string
    rootPath: string
    version: number
    createdAt: string
    updatedAt: string
}

interface FolderDTO {
    id: string
    name: string
    parentID: string | null
    color?: string | null
    icon?: string | null
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
}

interface DocumentDTO {
    id: string
    title: string
    relativePath: string
    folderID?: string | null
    favorite: boolean
    deleted: boolean
    createdAt: string
    updatedAt: string
}

export class GoogleDriveProvider implements ISyncProvider {
    constructor(private accessToken: string) { }

    public async downloadData(workspaceID: string): Promise<SyncData | null> {
        const workspaceFolder = await this.findWorkspaceFolder(workspaceID)
        if(!workspaceFolder) return null
        const workspaceFile = await api.findFile(this.accessToken, 'workspace.json', workspaceFolder.id)
        const foldersFile = await api.findFile(this.accessToken, 'folders.json', workspaceFolder.id)
        const documentsFile = await api.findFile(this.accessToken, 'documents.json', workspaceFolder.id)
        if(!workspaceFile || !foldersFile || !documentsFile) return null
        return {
            workspace: this.toWorkspace(await this.downloadJSONFile<WorkspaceDTO>('workspace.json', workspaceFolder.id)),
            folders: this.toFolders(await this.downloadJSONFile<FolderDTO[]>('folders.json', workspaceFolder.id)),
            documents: this.toDocuments(await this.downloadJSONFile<DocumentDTO[]>('documents.json', workspaceFolder.id))
        }
    }

    public async uploadData(metadata: SyncData): Promise<void> {
        const workspaceFolder = await this.getWorkspaceFolder(metadata.workspace.id)
        await this.uploadJSONFile('workspace.json', this.toWorkspaceDTO(metadata.workspace), workspaceFolder.id)
        await this.uploadJSONFile('folders.json', metadata.folders.map(folder => this.toFolderDTO(folder)), workspaceFolder.id)
        await this.uploadJSONFile('documents.json', metadata.documents.map(document => this.toDocumentDTO(document)), workspaceFolder.id)
    }
    
    public async downloadMarkdown(workspaceID: string, documentID: string): Promise<string | null> {
        const documentsFolder = await this.findDocumentsFolder(workspaceID)
        if(!documentsFolder) return null
        return await this.downloadMarkdownFile(documentID, documentsFolder.id)
    }
    
    public async uploadMarkdown(workspaceID: string, documentID: string, markdown: string): Promise<void> {
        const documentsFolder = await this.getDocumentsFolder(workspaceID)
        await this.uploadMarkdownFile(documentID, markdown, documentsFolder.id)
    }

    private async findNovaksharFolder(): Promise<api.GoogleDriveResource | null> {
        return await api.findFolder(this.accessToken, 'Novakshar')
    }

    private async findWorkspaceFolder(workspaceID: string): Promise<api.GoogleDriveResource | null> {
        const root = await this.findNovaksharFolder()
        if(!root) return null
        return await api.findFolder(this.accessToken, workspaceID, root.id)
    }

    private async findDocumentsFolder(workspaceID: string): Promise<api.GoogleDriveResource | null> {
        const workspace = await this.findWorkspaceFolder(workspaceID)
        if(!workspace) return null
        return await api.findFolder(this.accessToken, 'documents', workspace.id)
    }

    private async getNovaksharFolder(): Promise<api.GoogleDriveResource> {
        const folder = await this.findNovaksharFolder()
        if(folder) return folder
        return await api.createFolder(this.accessToken, 'Novakshar')
    }

    private async getWorkspaceFolder(workspaceID: string): Promise<api.GoogleDriveResource> {
        const folder = await this.findWorkspaceFolder(workspaceID)
        if(folder) return folder
        const root = await this.getNovaksharFolder()
        return await api.createFolder(this.accessToken, workspaceID, root.id)
    }

    private async getDocumentsFolder(workspaceID: string): Promise<api.GoogleDriveResource> {
        const folder = await this.findDocumentsFolder(workspaceID)
        if(folder) return folder
        const workspace = await this.getWorkspaceFolder(workspaceID)
        return await api.createFolder(this.accessToken, 'documents', workspace.id)
    }

    private async downloadJSONFile<T>(fileName: string, parentID: string): Promise<T> {
        const file = await api.findFile(this.accessToken, fileName, parentID)
        if(!file) throw new Error(`File not found: "${fileName}" in parent folder "${parentID}"`)
        const content = await api.downloadFile(this.accessToken, file.id)
        return JSON.parse(content) as T
    }

    private async uploadJSONFile(fileName: string, data: unknown, parentID: string): Promise<void> {
        const content = JSON.stringify(data, null, 4)
        const file = await api.findFile(this.accessToken, fileName, parentID)
        if(file) await api.updateFile(this.accessToken, file.id, content, 'application/json')
        else await api.uploadFile(this.accessToken, fileName, content, 'application/json', parentID)
    }

    private async downloadMarkdownFile(documentID: string, parentID: string): Promise<string> {
        const fileName = `${documentID}.md`
        const file = await api.findFile(this.accessToken, fileName, parentID)
        if(!file) throw new Error(`File not found: "${fileName}" in parent folder "${parentID}"`)
        return await api.downloadFile(this.accessToken, file.id)
    }

    private async uploadMarkdownFile(documentID: string, markdown: string, parentID: string): Promise<void> {
        const fileName = `${documentID}.md`
        const file = await api.findFile(this.accessToken, fileName, parentID)
        if(file) await api.updateFile(this.accessToken, file.id, markdown, 'text/markdown')
        else await api.uploadFile(this.accessToken, fileName, markdown, 'text/markdown', parentID)
    }

    private toWorkspace(data: WorkspaceDTO): Workspace {
        return new Workspace({
            id: data.id,
            name: data.name,
            rootPath: data.rootPath,
            version: data.version,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt)
        })
    }

    private toFolders(data: FolderDTO[]): Folder[] {
        return data.map(folder => new Folder({
            id: folder.id,
            name: folder.name,
            parentID: folder.parentID,
            color: folder.color ?? null,
            icon: folder.icon ?? null,
            createdAt: new Date(folder.createdAt),
            updatedAt: new Date(folder.updatedAt),
            deletedAt: folder.deletedAt ? new Date(folder.deletedAt) : null
        }))
    }

    private toDocuments(data: DocumentDTO[]): Document[] {
        return data.map(document => new Document({
            id: document.id,
            title: document.title,
            relativePath: document.relativePath,
            folderID: document.folderID ?? null,
            favorite: document.favorite,
            deleted: document.deleted,
            createdAt: new Date(document.createdAt),
            updatedAt: new Date(document.updatedAt)
        }))
    }

    private toWorkspaceDTO(workspace: Workspace): WorkspaceDTO {
        return {
            id: workspace.id,
            name: workspace.name,
            rootPath: workspace.rootPath,
            version: workspace.version,
            createdAt: workspace.createdAt.toISOString(),
            updatedAt: workspace.updatedAt.toISOString()
        }
    }

    private toFolderDTO(folder: Folder): FolderDTO {
        return {
            id: folder.id,
            name: folder.name,
            parentID: folder.parentID,
            color: folder.color ?? null,
            icon: folder.icon ?? null,
            createdAt: folder.createdAt.toISOString(),
            updatedAt: folder.updatedAt.toISOString(),
            deletedAt: folder.deletedAt ? folder.deletedAt.toISOString() : null
        }
    }

    private toDocumentDTO(document: Document): DocumentDTO {
        return {
            id: document.id,
            title: document.title,
            relativePath: document.relativePath,
            folderID: document.folderID,
            favorite: document.favorite,
            deleted: document.deleted,
            createdAt: document.createdAt.toISOString(),
            updatedAt: document.updatedAt.toISOString()
        }
    }
}
