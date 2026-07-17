import { Folder, Workspace, Document } from '@novakshar/core'

export interface SyncData {
    workspace: Workspace,
    folders: Folder[]
    documents: Document[]
}
