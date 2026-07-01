import { BaseEntity } from './BaseEntity'

export interface Device extends BaseEntity {
    name: string
    lastSeen: Date
}
