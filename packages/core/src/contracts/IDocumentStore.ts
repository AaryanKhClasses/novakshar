import { Document } from '../models/Document'

export interface IDocumentStore {
    get(id: string): Promise<Document | null>
    getAll(): Promise<Document[]>
    create(document: Document): Promise<void>
    update(document: Document): Promise<void>
    delete(id: string): Promise<void>
}
