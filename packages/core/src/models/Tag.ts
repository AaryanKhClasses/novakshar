import { BaseEntity } from './BaseEntity'

export interface Tag extends BaseEntity {
    name: string
    color?: string
}
