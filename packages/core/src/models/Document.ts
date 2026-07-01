import { BaseEntity } from './BaseEntity'

export interface Document extends BaseEntity {
    title: string
    relativePath: string
    folderID?: string
    favorite: boolean
    deleted: boolean
}
