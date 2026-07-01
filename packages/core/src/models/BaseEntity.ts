export interface BaseEntityProps {
    id: string
    createdAt: Date
    updatedAt: Date
}

export abstract class BaseEntity {
    private readonly _id: string
    private readonly _createdAt: Date
    private _updatedAt: Date

    protected constructor(props: BaseEntityProps) {
        this._id = props.id
        this._createdAt = props.createdAt
        this._updatedAt = props.updatedAt
    }

    public get id(): string { return this._id }
    public get createdAt(): Date { return this._createdAt }
    public get updatedAt(): Date { return this._updatedAt }

    public touch(now: Date): void { this._updatedAt = now }
    public equals(entity: BaseEntity): boolean { return this.id === entity.id }
}
