import { Document } from '../models/Document'

export interface IDocumentStore {
    get(id: string): Promise<Document | null>
    getByFolder(folderID: string | null): Promise<Document[]>
    save(document: Document): Promise<void>
    delete(id: string): Promise<void>
}
