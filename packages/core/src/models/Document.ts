import { ValidationError } from '../errors'
import { BaseEntity } from './BaseEntity'

export interface DocumentProps {
    id: string
    title: string
    relativePath: string
    folderID?: string | null
    favorite: boolean
    deleted: boolean
    createdAt: Date
    updatedAt: Date
}

export class Document extends BaseEntity {
    private _title: string
    private _relativePath: string
    private _folderID?: string | null
    private _favorite: boolean
    private _deleted: boolean

    constructor(props: DocumentProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        })
        this.validateTitle(props.title)
        this.validatePath(props.relativePath)

        this._title = props.title
        this._relativePath = props.relativePath
        this._folderID = props.folderID ?? null
        this._favorite = props.favorite
        this._deleted = props.deleted
    }

    public get title(): string { return this._title }
    public get relativePath(): string { return this._relativePath }
    public get folderID(): string | null | undefined { return this._folderID }
    public get favorite(): boolean { return this._favorite }
    public get deleted(): boolean { return this._deleted }

    public rename(title: string, now: Date): void {
        this.validateTitle(title)
        const trimmed = title.trim()
        if(trimmed === this._title) return
        this._title = trimmed
        this.touch(now)
    }

    public moveToFolder(folderID: string | null, now: Date): void {
        if(folderID === this._folderID) return
        this._folderID = folderID
        this.touch(now)
    }

    public moveToPath(relativePath: string, now: Date): void {
        this.validatePath(relativePath)
        if(relativePath === this._relativePath) return
        this._relativePath = relativePath
        this.touch(now)
    }

    public markAsFavorite(now: Date): void {
        if(this._favorite) return
        this._favorite = true
        this.touch(now)
    }

    public removeFromFavorites(now: Date): void {
        if(!this._favorite) return
        this._favorite = false
        this.touch(now)
    }

    public softDelete(now: Date): void {
        if(this._deleted) return
        this._deleted = true
        this.touch(now)
    }

    public restore(now: Date): void {
        if(!this._deleted) return
        this._deleted = false
        this.touch(now)
    }

    private validateTitle(title: string): void {
        if(title.trim().length === 0) throw new ValidationError('Document title cannot be empty', 'DOCUMENT_TITLE_EMPTY')
    }

    private validatePath(relativePath: string): void {
        if(relativePath.trim().length === 0) throw new ValidationError('Document path cannot be empty', 'DOCUMENT_PATH_EMPTY')
    }
}
