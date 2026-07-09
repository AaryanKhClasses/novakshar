import { IPCChannels } from '@shared/channels'
import { DocumentInfo } from '@shared/document'
import { FolderInfo } from '@shared/folder'
import { WorkspaceInfo } from '@shared/workspace'
import { ipcRenderer } from 'electron'

export const api = {
    workspace: {
        ping(): Promise<string> {
            return ipcRenderer.invoke(IPCChannels.workspace.ping)
        },
        create(): Promise<WorkspaceInfo | null> {
            return ipcRenderer.invoke(IPCChannels.workspace.create)
        },
        open(): Promise<WorkspaceInfo | null> {
            return ipcRenderer.invoke(IPCChannels.workspace.open)
        },
        close(): Promise<void> {
            return ipcRenderer.invoke(IPCChannels.workspace.close)
        }
    },
    explorer: {
        getRootFolders(): Promise<FolderInfo[]> {
            return ipcRenderer.invoke(IPCChannels.explorer.getRootFolders)
        },
        getFolders(): Promise<FolderInfo[]> {
            return ipcRenderer.invoke(IPCChannels.explorer.getFolders)
        },
        getDocuments(): Promise<DocumentInfo[]> {
            return ipcRenderer.invoke(IPCChannels.explorer.getDocuments)
        },
        createFolder(parentID: string | null): Promise<FolderInfo> {
            return ipcRenderer.invoke(IPCChannels.explorer.createFolder, parentID)
        },
        createDocument(folderID: string | null): Promise<DocumentInfo> {
            return ipcRenderer.invoke(IPCChannels.explorer.createDocument, folderID)
        },
        renameFolder(folderID: string, name: string): Promise<void> {
            return ipcRenderer.invoke(IPCChannels.explorer.renameFolder, folderID, name)
        },
        renameDocument(documentID: string, title: string): Promise<void> {
            return ipcRenderer.invoke(IPCChannels.explorer.renameDocument, documentID, title)
        },
        deleteFolder(folderID: string): Promise<void> {
            return ipcRenderer.invoke(IPCChannels.explorer.deleteFolder, folderID)
        },
        deleteDocument(documentID: string): Promise<void> {
            return ipcRenderer.invoke(IPCChannels.explorer.deleteDocument, documentID)
        }
    }
}
