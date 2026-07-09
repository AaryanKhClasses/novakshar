import { Document } from '../models/Document.js'

export interface IDocumentStore {
    get(id: string): Promise<Document | null>
    getAll(): Promise<Document[]>
    getByFolder(folderID: string | null): Promise<Document[]>
    save(document: Document): Promise<void>
    delete(id: string): Promise<void>
}
