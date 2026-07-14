import { ApplicationHost } from '@main/ApplicationHost'
import { IPCChannels } from '@shared/channels'
import { ipcMain } from 'electron'

export function registerWorkspaceIPC(host: ApplicationHost): void {
    ipcMain.handle(IPCChannels.workspace.ping, () => 'pong')
    ipcMain.handle(IPCChannels.workspace.create, () =>  host.createWorkspace())
    ipcMain.handle(IPCChannels.workspace.open, () => host.openWorkspace())
    ipcMain.handle(IPCChannels.workspace.getCurrent, () => host.getWorkspace())
    ipcMain.handle(IPCChannels.workspace.close, () => host.closeWorkspace())
    ipcMain.handle(IPCChannels.workspace.getRecents, () => host.getRecentWorkspaces())
    ipcMain.handle(IPCChannels.workspace.openRecent, (_, path: string) => host.openRecentWorkspace(path))
    ipcMain.handle(IPCChannels.workspace.removeRecent, (_, path: string) => host.removeRecentWorkspace(path))
}
