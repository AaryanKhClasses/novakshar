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

    public async showUnsavedChanges(documentName: string): Promise<'save' | 'discard' | 'cancel'> {
        const result = await dialog.showMessageBox(this.window, {
            type: 'warning',
            title: 'Unsaved Changes',
            message: `"${documentName}" has unsaved changes.`,
            detail: 'Do you want to save your changes before closing?',
            buttons: ['Save', 'Discard', 'Cancel'],
            defaultId: 0,
            cancelId: 2
        })
        switch(result.response) {
            case 0: return 'save'
            case 1: return 'discard'
            default: return 'cancel'
        }
    }
}
