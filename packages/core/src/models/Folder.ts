import { BaseEntity } from './BaseEntity'

export interface Folder extends BaseEntity {
    name: string
    parentID?: string
    color?: string
    icon?: string
}
