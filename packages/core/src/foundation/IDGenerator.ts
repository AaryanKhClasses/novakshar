import { ulid } from 'ulid'

export interface IIDGenerator {
    generate(): string
}

export class UlidGenerator implements IIDGenerator {
    generate(): string { return ulid() }
}
