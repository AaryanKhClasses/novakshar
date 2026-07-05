import { Document } from '../models/Document.js'

export interface ISearchIndex {
    indexDocument(document: Document): Promise<void>
    removeDocument(documentId: string): Promise<void>
    rebuild(): Promise<void>
}
