export interface Scenario {
    readonly name: string
    run(): Promise<void>
}
