import { Document, IDocumentStore } from '@novakshar/core'
import { DocumentQueries, SQLiteContext } from '../../index.js'
import { Scalar } from '@op-engineering/op-sqlite'

interface DocumentRow {
    id: string
    folder_id: string | null
    title: string
    relative_path: string
    favorite: number
    deleted: number
    created_at: string
    updated_at: string
}

export class SQLiteDocumentStore implements IDocumentStore {
    constructor(private readonly context: SQLiteContext) { }
    
    public async get(id: string): Promise<Document | null> {
        const row = this.context.get<DocumentRow>(DocumentQueries.Get, [id])
        return row ? this.toEntity(row) : null
    }

    public async getAll(): Promise<Document[]> {
        const rows = this.context.all<DocumentRow>(DocumentQueries.GetAll)
        return rows.map(row => this.toEntity(row))
    }

    public async getByFolder(folderID: string | null): Promise<Document[]> {
        const rows = folderID === null
            ? this.context.all<DocumentRow>(DocumentQueries.GetRootDocuments)
            : this.context.all<DocumentRow>(DocumentQueries.GetByFolder, [folderID])
        return rows.map(row => this.toEntity(row))
    }

    public async save(document: Document): Promise<void> {
        this.context.run(DocumentQueries.InsertOrReplace, this.toRow(document))
    }
    
    public async delete(id: string): Promise<void> {
        this.context.run(DocumentQueries.Delete, [id])
    }

    private toEntity(row: Scalar<DocumentRow>): Document {
        return new Document({
            id: row.id,
            folderID: row.folder_id ?? null,
            title: row.title,
            relativePath: row.relative_path,
            favorite: Boolean(row.favorite),
            deleted: Boolean(row.deleted),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        })
    }

    private toRow(document: Document): Scalar<DocumentRow> {
        return {
            id: document.id,
            folder_id: document.folderID ?? null,
            title: document.title,
            relative_path: document.relativePath,
            favorite: document.favorite ? 1 : 0,
            deleted: document.deleted ? 1 : 0,
            created_at: document.createdAt.toISOString(),
            updated_at: document.updatedAt.toISOString()
        }
    }
}
