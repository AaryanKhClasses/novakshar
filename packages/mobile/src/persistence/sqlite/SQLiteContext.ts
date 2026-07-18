import { DB, QueryResult, Scalar } from '@op-engineering/op-sqlite'

export class SQLiteContext {
    constructor(private readonly database: DB) { }

    public run(sql: string, params?: Scalar[]): QueryResult {
        return this.database.executeSync(sql, params)
    }

    public get<T>(sql: string, params?: Scalar[]): T | undefined {
        const result = this.database.executeSync(sql, params)
        if(result.rows.length === 0) return undefined
        return result.rows[0] as T
    }

    public all<T>(sql: string, params?: Scalar[]): T[] {
        const result = this.database.executeSync(sql, params)
        return result.rows as T[]
    }

    public exec(sql: string): void {
        this.database.executeSync(sql)
    }

    public async transaction(callback: () => Promise<void>): Promise<void> {
        await this.database.transaction(async() => await callback())
    }
}
