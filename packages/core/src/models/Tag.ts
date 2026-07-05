import { ValidationError } from '../errors/index.js'
import { BaseEntity } from './BaseEntity.js'

export interface TagProps {
    id: string
    name: string
    color?: string | null
    createdAt: Date
    updatedAt: Date
}

export class Tag extends BaseEntity {
    private _name: string
    private _color?: string | null

    constructor(props: TagProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        })
        this.validateName(props.name)

        this._name = props.name
        this._color = props.color ?? null
    }

    public get name(): string { return this._name }
    public get color(): string | null | undefined { return this._color }

    public rename(name: string, now: Date): void {
        this.validateName(name)
        const trimmed = name.trim()
        if(trimmed === this._name) return
        this._name = trimmed
        this.touch(now)
    }

    public changeColor(color: string | null, now: Date): void {
        if(color === this._color) return
        this._color = color
        this.touch(now)
    }

    private validateName(name: string): void {
        if(name.trim().length === 0) throw new ValidationError('Tag name cannot be empty', 'TAG_NAME_EMPTY')
    }
}
