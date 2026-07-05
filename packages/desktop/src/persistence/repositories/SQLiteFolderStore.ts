import { Folder, IFolderStore } from '@novakshar/core'
import { FolderQueries } from '../queries/FolderQueries.js'
import { SQLiteContext } from '../sqlite/SQLiteContext.js'

interface FolderRow {
    id: string
    parent_id: string | null
    name: string
    color: string | null
    icon: string | null
    created_at: string
    updated_at: string
}

export class SQLiteFolderStore implements IFolderStore {
    constructor(private readonly context: SQLiteContext) { }

    public async get(id: string): Promise<Folder | null> {
        const row = this.context.get<FolderRow>(FolderQueries.Get, { id })
        return row ? this.toEntity(row) : null
    }

    public async getChildren(parentID: string): Promise<Folder[]> {
        const rows = this.context.all<FolderRow>(FolderQueries.GetChildren, { parentID })
        return rows.map(row => this.toEntity(row))
    }

    public async getRootFolders(): Promise<Folder[]> {
        const rows = this.context.all<FolderRow>(FolderQueries.GetRootFolders)
        return rows.map(row => this.toEntity(row))
    }

    public async save(folder: Folder): Promise<void> {
        this.context.run(FolderQueries.InsertOrReplace, this.toRow(folder))
    }

    public async delete(id: string): Promise<void> {
        this.context.run(FolderQueries.Delete, { id })
    }

    private toEntity(row: FolderRow): Folder {
        return new Folder({
            id: row.id,
            parentID: row.parent_id,
            name: row.name,
            color: row.color,
            icon: row.icon,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        })
    }

    private toRow(folder: Folder): FolderRow {
        return {
            id: folder.id,
            parent_id: folder.parentID ?? null,
            name: folder.name,
            color: folder.color ?? null,
            icon: folder.icon ?? null,
            created_at: folder.createdAt.toISOString(),
            updated_at: folder.updatedAt.toISOString()
        }
    }
}
