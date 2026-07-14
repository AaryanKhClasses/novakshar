import { ApplicationHost } from '@main/ApplicationHost'
import { IPCChannels } from '@shared/channels'
import { ipcMain } from 'electron'

export function registerWindowIPC(host: ApplicationHost): void {
    ipcMain.handle(IPCChannels.window.minimize, () => host.minimizeWindow())
    ipcMain.handle(IPCChannels.window.maximize, () => host.maximizeWindow())
    ipcMain.handle(IPCChannels.window.close, () => host.closeWindow())
    ipcMain.handle(IPCChannels.window.isMaximized, () => host.isWindowMaximized())
}
