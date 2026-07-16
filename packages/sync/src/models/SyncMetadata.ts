import { SyncDocumentMetadata, SyncManifest } from '../index.js'
import { Folder } from '@novakshar/core'

export interface SyncMetadata {
    manifest: SyncManifest
    folders: Folder[]
    documents: SyncDocumentMetadata[]
}
