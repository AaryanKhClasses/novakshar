import { Attachment, IAttachmentStore } from '@novakshar/core'
import { AttachmentQueries, SQLiteContext } from '../../index.js'
import { Scalar } from '@op-engineering/op-sqlite'

interface AttachmentRow {
    id: string
    document_id: string
    filename: string
    relative_path: string
    mime_type: string
    size: number
    checksum: string
    created_at: string
    updated_at: string
}

export class SQLiteAttachmentStore implements IAttachmentStore {
    constructor(private readonly context: SQLiteContext) { }
    
    public async get(id: string): Promise<Attachment | null> {
        const row = this.context.get<AttachmentRow>(AttachmentQueries.Get, [id])
        return row ? this.toEntity(row) : null
    }
    
    public async save(document: Attachment): Promise<void> {
        this.context.run(AttachmentQueries.InsertOrReplace, this.toRow(document))
    }
    
    public async delete(id: string): Promise<void> {
        this.context.run(AttachmentQueries.Delete, [id])
    }

    private toEntity(row: Scalar<AttachmentRow>): Attachment {
        return new Attachment({
            id: row.id,
            documentID: row.document_id,
            filename: row.filename,
            relativePath: row.relative_path,
            mimeType: row.mime_type,
            size: row.size,
            checksum: row.checksum,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        })
    }

    private toRow(document: Attachment): Scalar<AttachmentRow> {
        return [
            document.id,
            document.documentID,
            document.filename,
            document.relativePath,
            document.mimeType,
            document.size,
            document.checksum,
            document.createdAt.toISOString(),
            document.updatedAt.toISOString()
        ]
    }
}
