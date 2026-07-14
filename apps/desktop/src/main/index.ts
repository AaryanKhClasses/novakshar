import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { ApplicationHost } from './ApplicationHost'
import { registerEditorIPC, registerExplorerIPC, registerWindowIPC, registerWorkspaceIPC } from './ipc'
import { NativeDialogService } from './services'
import { ApplicationStateStore } from './state'

function createWindow(): BrowserWindow {
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame: false,
        titleBarStyle: 'hidden',
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? {} : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if(is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
    return mainWindow
}

app.whenReady().then(async() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    const mainWindow = createWindow()
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
        if(BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})
