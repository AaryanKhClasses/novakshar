import { ValidationError } from '../errors'
import { BaseEntity } from './BaseEntity'

export interface WorkspaceProps {
    id: string
    name: string
    rootPath: string
    version: number
    createdAt: Date
    updatedAt: Date
}

export class Workspace extends BaseEntity {
    private _name: string
    private _rootPath: string
    private _version: number

    constructor(props: WorkspaceProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        })
        this.validateName(props.name)
        this.validateRootPath(props.rootPath)

        this._name = props.name
        this._rootPath = props.rootPath
        this._version = props.version
    }

    public get name(): string { return this._name }
    public get rootPath(): string { return this._rootPath }
    public get version(): number { return this._version }

    public rename(name: string, now: Date): void {
        this.validateName(name)
        const trimmed = name.trim()
        if(trimmed === this._name) return
        this._name = trimmed
        this.touch(now)
    }

    public changeRootPath(rootPath: string, now: Date): void {
        this.validateRootPath(rootPath)
        if(rootPath === this._rootPath) return
        this._rootPath = rootPath
        this.touch(now)
    }

    public upgradeVersion(version: number, now: Date): void {
        if(version <= this._version) return
        this._version = version
        this.touch(now)
    }

    private validateName(name: string): void {
        if(name.trim().length === 0) throw new ValidationError('Workspace name cannot be empty', 'WORKSPACE_NAME_EMPTY')
    }

    private validateRootPath(rootPath: string): void {
        if(rootPath.trim().length === 0) throw new ValidationError('Workspace root path cannot be empty', 'WORKSPACE_ROOT_PATH_EMPTY')
    }
}
