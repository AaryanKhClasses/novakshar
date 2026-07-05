import { ValidationError } from '../errors/index.js'
import { BaseEntity } from './BaseEntity.js'

export interface RevisionProps {
    id: string
    documentID: string
    version: number
    checksum: string
    createdAt: Date
    updatedAt: Date
}

export class Revision extends BaseEntity {
    private readonly _documentID: string
    private readonly _version: number
    private readonly _checksum: string

    constructor(props: RevisionProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        })
        this.validateVersion(props.version)
        this.validateChecksum(props.checksum)

        this._documentID = props.documentID
        this._version = props.version
        this._checksum = props.checksum
    }

    public get documentID(): string { return this._documentID }
    public get version(): number { return this._version }
    public get checksum(): string { return this._checksum }

    private validateVersion(version: number): void {
        if(version <= 0) throw new ValidationError('Revision version must be greater than 0', 'REVISION_VERSION_INVALID')
    }

    private validateChecksum(checksum: string): void {
        if(checksum.trim().length === 0) throw new ValidationError('Revision checksum cannot be empty', 'REVISION_CHECKSUM_EMPTY')
    }
}
