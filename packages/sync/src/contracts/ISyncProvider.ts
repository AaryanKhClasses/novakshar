import { SyncData } from '../index.js'

export interface ISyncProvider {
    downloadData(workspaceID: string): Promise<SyncData | null>
    uploadData(data: SyncData): Promise<void>
    downloadMarkdown(workspaceID: string, documentID: string): Promise<string | null>
    uploadMarkdown(workspaceID: string, documentID: string, markdown: string): Promise<void>
}
