import { SyncMetadata } from '../index.js'

export interface ISyncProvider {
    downloadMetadata(workspaceID: string): Promise<SyncMetadata>
    uploadMetadata(metadata: SyncMetadata): Promise<void>
    downloadMarkdown(workspaceID: string, documentID: string): Promise<string>
    uploadMarkdown(workspaceID: string, documentID: string, markdown: string): Promise<void>
}
