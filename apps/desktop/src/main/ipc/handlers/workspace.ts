import { ApplicationHost } from '@main/ApplicationHost'
import { IPCChannels } from '@shared/channels'
import { CreateWorkspaceRequest, OpenWorkspaceRequest } from '@shared/workspace'
import { ipcMain } from 'electron'

export function registerWorkspaceIPC(host: ApplicationHost): void {
    ipcMain.handle(IPCChannels.workspace.ping, async() => {
        return 'pong'
    })

    ipcMain.handle(IPCChannels.workspace.create, async(_, request: CreateWorkspaceRequest) => {
        return await host.createWorkspace(request.path, request.name)
    })

    ipcMain.handle(IPCChannels.workspace.open, async(_, request: OpenWorkspaceRequest) => {
        return await host.openWorkspace(request.path)
    })

    ipcMain.handle(IPCChannels.workspace.close, async() => {
        await host.closeWorkspace()
    })
}
