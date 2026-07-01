import { BaseEntity } from './BaseEntity'

export interface Workspace extends BaseEntity {
    name: string
    rootPath: string
    version: number
}
