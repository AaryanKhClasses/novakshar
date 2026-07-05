import { ValidationError } from '../errors/index.js'
import { BaseEntity } from './BaseEntity.js'

export interface DeviceProps {
    id: string
    name: string
    lastSeen: Date
    createdAt: Date
    updatedAt: Date
}

export class Device extends BaseEntity {
    private _name: string
    private _lastSeen: Date

    constructor(props: DeviceProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        })
        this.validateName(props.name)

        this._name = props.name
        this._lastSeen = props.lastSeen
    }

    public get name(): string { return this._name }
    public get lastSeen(): Date { return this._lastSeen }

    public rename(name: string, now: Date): void {
        this.validateName(name)
        const trimmed = name.trim()
        if(trimmed === this._name) return
        this._name = trimmed
        this.touch(now)
    }

    public heartbeat(now: Date): void {
        this._lastSeen = now
        this.touch(now)
    }

    private validateName(name: string): void {
        if(name.trim().length === 0) throw new ValidationError('Device name cannot be empty', 'DEVICE_NAME_EMPTY')
    }
}
