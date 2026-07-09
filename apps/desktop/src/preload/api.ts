import { IPCChannels } from '@shared/channels'
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
        createFolder(parentID: string | null): Promise<FolderInfo> {
            return ipcRenderer.invoke(IPCChannels.explorer.createFolder, parentID)
        },
        renameFolder(folderID: string, name: string): Promise<void> {
            return ipcRenderer.invoke(IPCChannels.explorer.renameFolder, folderID, name)
        },
        deleteFolder(folderID: string): Promise<void> {
            return ipcRenderer.invoke(IPCChannels.explorer.deleteFolder, folderID)
        }
    }
}
