import { Document } from '../models/Document'

export interface IDocumentStore {
    get(id: string): Promise<Document | null>
    save(document: Document): Promise<void>
    delete(id: string): Promise<void>
}
