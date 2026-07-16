export interface SyncDocumentMetadata {
    id: string
    title: string
    folderID: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}
