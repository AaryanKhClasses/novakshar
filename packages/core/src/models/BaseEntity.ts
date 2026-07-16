export interface BaseEntityProps {
    id: string
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date | null
}

export abstract class BaseEntity {
    private readonly _id: string
    private readonly _createdAt: Date
    private _updatedAt: Date
    private _deletedAt?: Date | null

    protected constructor(props: BaseEntityProps) {
        this._id = props.id
        this._createdAt = props.createdAt
        this._updatedAt = props.updatedAt
        this._deletedAt = props.deletedAt ?? null
    }

    public get id(): string { return this._id }
    public get createdAt(): Date { return this._createdAt }
    public get updatedAt(): Date { return this._updatedAt }
    public get deletedAt(): Date | null | undefined { return this._deletedAt }

    public touch(now: Date): void { this._updatedAt = now }
    public equals(entity: BaseEntity): boolean { return this.id === entity.id }
}
