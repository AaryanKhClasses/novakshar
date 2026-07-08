import { WorkspaceInfo } from '@shared/workspace'
import { FolderInfo } from '@shared/folder'

export { }

declare global {
    interface Window {
        novakshar: {
            workspace: {
                ping(): Promise<string>
                create(): Promise<WorkspaceInfo | null>
                open(): Promise<WorkspaceInfo | null>
                close(): Promise<void>
            },
            explorer: {
                getRootFolders(): Promise<FolderInfo[]>
                createFolder(): Promise<FolderInfo>
                renameFolder(folderID: string, name: string): Promise<void>
                deleteFolder(folderID: string): Promise<void>
            }
        }
    }
}
