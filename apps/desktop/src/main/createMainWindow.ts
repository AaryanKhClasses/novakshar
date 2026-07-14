import { BrowserWindow, shell } from 'electron'
import { WindowStateManager } from './state'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

export async function createWindow(windowState: WindowStateManager): Promise<BrowserWindow> {
    const options = await windowState.createWindowOptions()
    const mainWindow = new BrowserWindow({
        ...options,
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

    await windowState.restore(mainWindow)
    return mainWindow
}
