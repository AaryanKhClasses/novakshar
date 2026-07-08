import { ApplicationHost } from '@main/ApplicationHost'
import { IPCChannels } from '@shared/channels'
import { ipcMain } from 'electron'

export function registerExplorerIPC(host: ApplicationHost): void {
    ipcMain.handle(IPCChannels.explorer.getRootFolders, () => host.getRootFolders())
    ipcMain.handle(IPCChannels.explorer.createFolder, () => host.createFolder())
    ipcMain.handle(IPCChannels.explorer.renameFolder, (_, folderID: string, name: string) => host.renameFolder(folderID, name))
    ipcMain.handle(IPCChannels.explorer.deleteFolder, (_, folderID: string) => host.deleteFolder(folderID))
}
