import { ValidationError } from '../errors'
import { BaseEntity } from './BaseEntity'

export interface FolderProps {
    id: string
    name: string
    parentID?: string | null
    color?: string | null
    icon?: string | null
    createdAt: Date
    updatedAt: Date
}

export class Folder extends BaseEntity {
    private _name: string
    private _parentID?: string | null
    private _color?: string | null
    private _icon?: string | null

    constructor(props: FolderProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        })
        this.validateName(props.name)

        this._name = props.name
        this._parentID = props.parentID ?? null
        this._color = props.color ?? null
        this._icon = props.icon ?? null
    }

    public get name(): string { return this._name }
    public get parentID(): string | null | undefined { return this._parentID }
    public get color(): string | null | undefined { return this._color }
    public get icon(): string | null | undefined { return this._icon }

    public rename(name: string, now: Date): void {
        this.validateName(name)
        const trimmed = name.trim()
        if(trimmed === this._name) return
        this._name = trimmed
        this.touch(now)
    }

    public move(parentID: string | null, now: Date): void {
        if(parentID === this._parentID) return
        this._parentID = parentID
        this.touch(now)
    }

    public changeColor(color: string | null, now: Date): void {
        if(color === this._color) return
        this._color = color
        this.touch(now)
    }
    
    public changeIcon(icon: string | null, now: Date): void {
        if(icon === this._icon) return
        this._icon = icon
        this.touch(now)
    }

    private validateName(name: string): void {
        if(name.trim().length === 0) throw new ValidationError('Folder name cannot be empty', 'FOLDER_NAME_EMPTY')
    }
}
