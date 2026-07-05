import { IPCChannels } from '@shared/channels'
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
    }
}
