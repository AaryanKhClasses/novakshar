import { IPCChannels } from '@shared/channels'
import { CreateWorkspaceRequest, OpenWorkspaceRequest, WorkspaceInfo } from '@shared/workspace'
import { ipcRenderer } from 'electron'

export const api = {
    workspace: {
        ping(): Promise<string> {
            return ipcRenderer.invoke(IPCChannels.workspace.ping)
        },
        create(request: CreateWorkspaceRequest): Promise<WorkspaceInfo> {
            return ipcRenderer.invoke(IPCChannels.workspace.create, request)
        },
        open(request: OpenWorkspaceRequest): Promise<WorkspaceInfo> {
            return ipcRenderer.invoke(IPCChannels.workspace.open, request)
        },
        close(): Promise<void> {
            return ipcRenderer.invoke(IPCChannels.workspace.close)
        }
    }
}
