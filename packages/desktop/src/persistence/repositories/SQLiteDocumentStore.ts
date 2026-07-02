import { Document, IDocumentStore } from '@novakshar/core'
import { SQLiteContext } from '../sqlite/SQLiteContext'
import { DocumentQueries } from '../..'

interface DocumentRow {
    id: string
    folder_id: string | null
    title: string
    relative_path: string
    favorite: boolean
    deleted: boolean
    created_at: string
    updated_at: string
}

export class SQLiteDocumentStore implements IDocumentStore {
    constructor(private readonly context: SQLiteContext) { }
    
    public async get(id: string): Promise<Document | null> {
        const row = this.context.get<DocumentRow>(DocumentQueries.Get, { id })
        return row ? this.toEntity(row) : null
    }
    
    public async save(document: Document): Promise<void> {
        this.context.run(DocumentQueries.InsertOrReplace, this.toRow(document))
    }
    
    public async delete(id: string): Promise<void> {
        this.context.run(DocumentQueries.Delete, { id })
    }

    private toEntity(row: DocumentRow): Document {
        return new Document({
            id: row.id,
            folderID: row.folder_id ?? null,
            title: row.title,
            relativePath: row.relative_path,
            favorite: row.favorite,
            deleted: row.deleted,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        })
    }

    private toRow(document: Document): DocumentRow {
        return {
            id: document.id,
            folder_id: document.folderID ?? null,
            title: document.title,
            relative_path: document.relativePath,
            favorite: document.favorite,
            deleted: document.deleted,
            created_at: document.createdAt.toISOString(),
            updated_at: document.updatedAt.toISOString()
        }
    }
}
