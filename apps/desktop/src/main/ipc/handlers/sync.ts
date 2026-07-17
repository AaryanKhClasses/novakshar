import { ApplicationHost } from '@main/ApplicationHost'
import { IPCChannels } from '@shared/channels'
import { ipcMain } from 'electron'

export function registerSyncIPC(host: ApplicationHost): void {
    ipcMain.handle(IPCChannels.sync.getState, () => host.getSyncState())
    ipcMain.handle(IPCChannels.sync.toggle, () => host.toggleSync())
    ipcMain.handle(IPCChannels.sync.syncNow, () => host.syncNow())
}
