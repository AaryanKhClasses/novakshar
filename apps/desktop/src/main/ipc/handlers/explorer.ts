import { ApplicationHost } from '@main/ApplicationHost'
import { IPCChannels } from '@shared/channels'
import { ipcMain } from 'electron'

export function registerExplorerIPC(host: ApplicationHost): void {
    ipcMain.handle(IPCChannels.explorer.getRootFolders, () => host.getRootFolders())
    ipcMain.handle(IPCChannels.explorer.createFolder, () => host.createFolder())
}
