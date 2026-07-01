import { BaseEntity } from './BaseEntity'

export interface Attachment extends BaseEntity {
    documentID: string
    filename: string
    relativePath: string
    mimeType: string
    size: number
    checksum: string
}
