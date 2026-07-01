export interface EventMetadata {
    readonly id: string
    readonly occuredAt: Date
    readonly correlationID: string
    readonly causationID?: string
}
