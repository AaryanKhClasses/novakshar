import { BrowserWindow, dialog } from 'electron'

export class NativeDialogService {
    constructor(private readonly window: BrowserWindow) { }

    public async chooseWorkspaceFolder(): Promise<string | null> {
        const result = await dialog.showOpenDialog(this.window, {
            title: 'Choose Workspace Directory',
            properties: ['openDirectory', 'createDirectory']
        })

        if(result.canceled) return null
        return result.filePaths[0] ?? null
    }

    public async chooseExistingWorkspace(): Promise<string | null> {
        const result = await dialog.showOpenDialog(this.window, {
            title: 'Choose Existing Workspace',
            properties: ['openDirectory']
        })

        if(result.canceled) return null
        return result.filePaths[0] ?? null
    }
}
