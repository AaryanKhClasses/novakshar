import { SyncData } from '../index.js'

export interface SyncResult {
    data: SyncData
    markdown: Map<string, string>
    hadConflicts: boolean
}
