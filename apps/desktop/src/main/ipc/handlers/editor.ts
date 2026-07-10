import { ApplicationHost } from '@main/ApplicationHost'
import { IPCChannels } from '@shared/channels'
import { ipcMain } from 'electron'

export function registerEditorIPC(host: ApplicationHost): void {
    ipcMain.handle(IPCChannels.editor.open, (_, documentID: string) => host.openDocument(documentID))
    ipcMain.handle(IPCChannels.editor.save, (_, documentID: string, markdown: string) => host.saveDocument(documentID, markdown))
    ipcMain.handle(IPCChannels.editor.confirmClose, (_, title: string) => host.confirmCloseDocument(title))
}
