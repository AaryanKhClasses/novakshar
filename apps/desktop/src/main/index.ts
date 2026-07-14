import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain } from 'electron'
import { ApplicationHost } from './ApplicationHost'
import { createWindow } from './createMainWindow'
import { registerEditorIPC, registerExplorerIPC, registerWindowIPC, registerWorkspaceIPC } from './ipc'
import { NativeDialogService } from './services'
import { ApplicationStateStore, WindowStateManager } from './state'

app.whenReady().then(async() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    const stateStore = new ApplicationStateStore(app.getPath('userData'))
    const windowState = new WindowStateManager(stateStore)
    const mainWindow = await createWindow(windowState)
    const dialog = new NativeDialogService(mainWindow)
    const state = new ApplicationStateStore(app.getPath('userData'))
    const host = new ApplicationHost(dialog, state)

    ipcMain.on('ping', () => console.log('pong'))
    registerWindowIPC(host)
    registerWorkspaceIPC(host)
    registerExplorerIPC(host)
    registerEditorIPC(host)
    await host.restoreWorkspace()

    app.on('activate', function () {
        if(BrowserWindow.getAllWindows().length === 0) createWindow(windowState)
    })
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})
