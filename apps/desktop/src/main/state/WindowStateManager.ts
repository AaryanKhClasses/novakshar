import { BrowserWindow } from 'electron'
import { ApplicationStateStore } from '.'

export class WindowStateManager {
    private saveTimer: NodeJS.Timeout | null = null

    constructor(private readonly store: ApplicationStateStore) { }

    public async createWindowOptions(): Promise<Electron.BrowserWindowConstructorOptions> {
        const state = await this.store.load()
        return {
            width: state.window.width,
            height: state.window.height,
            x: state.window.x ?? undefined,
            y: state.window.y ?? undefined,
            frame: false,
            titleBarStyle: 'hidden',
            show: false,
            autoHideMenuBar: true
        }
    }

    public async restore(window: BrowserWindow): Promise<void> {
        const state = await this.store.load()
        if(state.window.maximized) window.maximize()
        this.attach(window)
    }

    private attach(window: BrowserWindow): void {
        window.on('move', () => this.scheduleSave(window))
        window.on('resize', () => this.scheduleSave(window))
        window.on('maximize', () => this.scheduleSave(window))
        window.on('unmaximize', () => this.scheduleSave(window))
    }

    private scheduleSave(window: BrowserWindow): void {
        if(this.saveTimer) clearTimeout(this.saveTimer)
        this.saveTimer = setTimeout(() => this.saveNow(window), 1000)
    }

    private async saveNow(window: BrowserWindow): Promise<void> {
        const state = await this.store.load()
        state.window.maximized = window.isMaximized()
        if(!window.isMaximized()) {
            const bounds = window.getBounds()
            state.window = {
                width: bounds.width,
                height: bounds.height,
                x: bounds.x,
                y: bounds.y,
                maximized: window.isMaximized()
            }
        }
        await this.store.save(state)
    }
}
