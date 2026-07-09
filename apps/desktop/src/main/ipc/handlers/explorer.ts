import { ApplicationHost } from '@main/ApplicationHost'
import { IPCChannels } from '@shared/channels'
import { ipcMain } from 'electron'

export function registerExplorerIPC(host: ApplicationHost): void {
    ipcMain.handle(IPCChannels.explorer.getRootFolders, () => host.getRootFolders())
    ipcMain.handle(IPCChannels.explorer.getFolders, (_) => host.getFolders())
    ipcMain.handle(IPCChannels.explorer.getDocuments, () => host.getDocuments())
    ipcMain.handle(IPCChannels.explorer.createFolder, (_, parentID: string | null) => host.createFolder(parentID))
    ipcMain.handle(IPCChannels.explorer.createDocument, (_, folderID: string | null) => host.createDocument(folderID))
    ipcMain.handle(IPCChannels.explorer.renameFolder, (_, folderID: string, name: string) => host.renameFolder(folderID, name))
    ipcMain.handle(IPCChannels.explorer.renameDocument, (_, documentID: string, title: string) => host.renameDocument(documentID, title))
    ipcMain.handle(IPCChannels.explorer.deleteFolder, (_, folderID: string) => host.deleteFolder(folderID))
    ipcMain.handle(IPCChannels.explorer.deleteDocument, (_, documentID: string) => host.deleteDocument(documentID))
}
