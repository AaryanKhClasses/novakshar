import { ValidationError } from '../errors'
import { BaseEntity } from './BaseEntity'

export interface AttachmentProps {
    id: string
    documentID: string
    filename: string
    relativePath: string
    mimeType: string
    size: number
    checksum: string
    createdAt: Date
    updatedAt: Date
}

export class Attachment extends BaseEntity {
    private readonly _documentID: string
    private _filename: string
    private _relativePath: string
    private readonly _mimeType: string
    private _size: number
    private _checksum: string

    constructor(props: AttachmentProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        })

        this.validateFilename(props.filename)
        this.validateRelativePath(props.relativePath)
        this.validateMimeType(props.mimeType)
        this.validateSize(props.size)
        this.validateChecksum(props.checksum)

        this._documentID = props.documentID
        this._filename = props.filename
        this._relativePath = props.relativePath
        this._mimeType = props.mimeType
        this._size = props.size
        this._checksum = props.checksum
    }

    public get documentID(): string { return this._documentID }
    public get filename(): string { return this._filename }
    public get relativePath(): string { return this._relativePath }
    public get mimeType(): string { return this._mimeType }
    public get size(): number { return this._size }
    public get checksum(): string { return this._checksum }

    public rename(filename: string, now: Date): void {
        this.validateFilename(filename)
        const trimmed = filename.trim()
        if(trimmed === this._filename) return
        this._filename = trimmed
        this.touch(now)
    }

    public move(relativePath: string, now: Date): void {
        this.validateRelativePath(relativePath)
        if(relativePath === this._relativePath) return
        this._relativePath = relativePath
        this.touch(now)
    }

    public updateChecksum(checksum: string, size: number, now: Date): void {
        this.validateChecksum(checksum)
        this.validateSize(size)
        this._checksum = checksum
        this._size = size
        this.touch(now)
    }

    private validateFilename(filename: string): void {
        if(filename.trim().length === 0) throw new ValidationError('Attachment filename cannot be empty', 'ATTACHMENT_FILENAME_EMPTY')
    }

    private validateRelativePath(relativePath: string): void {
        if(relativePath.trim().length === 0) throw new ValidationError('Attachment relative path cannot be empty', 'ATTACHMENT_RELATIVE_PATH_EMPTY')
    }

    private validateMimeType(mimeType: string): void {
        if(mimeType.trim().length === 0) throw new ValidationError('Attachment mime type cannot be empty', 'ATTACHMENT_MIME_TYPE_EMPTY')
    }

    private validateChecksum(checksum: string): void {
        if(checksum.trim().length === 0) throw new ValidationError('Attachment checksum cannot be empty', 'ATTACHMENT_CHECKSUM_EMPTY')
    }

    private validateSize(size: number): void {
        if(size < 0) throw new ValidationError('Attachment size cannot be negative', 'ATTACHMENT_SIZE_NEGATIVE')
    }
}
