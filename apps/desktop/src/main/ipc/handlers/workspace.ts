import { ApplicationHost } from '@main/ApplicationHost'
import { IPCChannels } from '@shared/channels'
import { ipcMain } from 'electron'

export function registerWorkspaceIPC(host: ApplicationHost): void {
    ipcMain.handle(IPCChannels.workspace.ping, async() => {
        return 'pong'
    })

    ipcMain.handle(IPCChannels.workspace.create, async() => {
        return await host.createWorkspace()
    })

    ipcMain.handle(IPCChannels.workspace.open, async() => {
        return await host.openWorkspace()
    })

    ipcMain.handle(IPCChannels.workspace.close, async() => {
        await host.closeWorkspace()
    })
}
