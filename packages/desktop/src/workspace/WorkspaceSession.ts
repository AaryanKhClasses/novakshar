import { DocumentService, FolderService, Workspace, WorkspaceManager } from '@novakshar/core'

export interface WorkspaceSession {
    readonly workspace: Workspace
    readonly workspaceManager: WorkspaceManager
    readonly documentService: DocumentService
    readonly folderService: FolderService
}
