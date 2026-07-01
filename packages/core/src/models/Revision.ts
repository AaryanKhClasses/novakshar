import { BaseEntity } from './BaseEntity'

export interface Revision extends BaseEntity {
    documentID: string
    version: number
    checksum: string
}
