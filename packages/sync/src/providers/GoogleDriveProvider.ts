import { Folder, Workspace, Document } from '@novakshar/core'
import { ISyncProvider, SyncData } from '../index.js'
import * as api from '../utils/GoogleDriveAPI.js'

export class GoogleDriveProvider implements ISyncProvider {
    constructor(private accessToken: string) { }

    public async downloadData(workspaceID: string): Promise<SyncData> {
        const workspaceFolder = await this.getWorkspaceFolder(workspaceID)
        return {
            workspace: await this.downloadJSONFile<Workspace>('workspace.json', workspaceFolder.id),
            folders: await this.downloadJSONFile<Folder[]>('folders.json', workspaceFolder.id),
            documents: await this.downloadJSONFile<Document[]>('documents.json', workspaceFolder.id)
        }
    }

    public async uploadData(metadata: SyncData): Promise<void> {
        const workspaceFolder = await this.getWorkspaceFolder(metadata.workspace.id)
        await this.uploadJSONFile('workspace.json', metadata.workspace, workspaceFolder.id)
        await this.uploadJSONFile('folders.json', metadata.folders, workspaceFolder.id)
        await this.uploadJSONFile('documents.json', metadata.documents, workspaceFolder.id)
    }
    
    public async downloadMarkdown(workspaceID: string, documentID: string): Promise<string> {
        const documentsFolder = await this.getDocumentsFolder(workspaceID)
        return await this.downloadMarkdownFile(documentID, documentsFolder.id)
    }
    
    public async uploadMarkdown(workspaceID: string, documentID: string, markdown: string): Promise<void> {
        const documentsFolder = await this.getDocumentsFolder(workspaceID)
        await this.uploadMarkdownFile(documentID, markdown, documentsFolder.id)
    }

    private async getNovaksharFolder(): Promise<api.GoogleDriveResource> {
        const folder = await api.findFolder(this.accessToken, 'Novakshar')
        if(folder) return folder
        return await api.createFolder(this.accessToken, 'Novakshar')
    }

    private async getWorkspaceFolder(workspaceID: string): Promise<api.GoogleDriveResource> {
        const root = await this.getNovaksharFolder()
        const folder = await api.findFolder(this.accessToken, workspaceID, root.id)
        if(folder) return folder
        return await api.createFolder(this.accessToken, workspaceID, root.id)
    }

    private async getDocumentsFolder(workspaceID: string): Promise<api.GoogleDriveResource> {
        const workspace = await this.getWorkspaceFolder(workspaceID)
        const folder = await api.findFolder(this.accessToken, 'documents', workspace.id)
        if(folder) return folder
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
}
