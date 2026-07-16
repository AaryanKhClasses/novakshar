import { SyncMetadata } from '../index.js'

export interface SyncResult {
    metadata: SyncMetadata
    markdown: Map<string, string>
    createdDocuments: string[]
    updatedDocuments: string[]
    deletedDocuments: string[]
    hadConflicts: boolean
}
