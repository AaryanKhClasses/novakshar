import { ipcMain } from 'electron'

export function registerWorkspaceIPC(): void {
    ipcMain.handle('workspace:ping', async() => {
        return 'pong'
    })
}
