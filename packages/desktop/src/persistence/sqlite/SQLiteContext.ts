import Database from 'better-sqlite3'

export class SQLiteContext {
    constructor(private readonly database: Database.Database) { }

    public run(sql: string, params?: any): Database.RunResult {
        const statement = this.database.prepare(sql)
        return params !== undefined ? statement.run(params) : statement.run()
    }

    public get<T>(sql: string, params?: any): T | undefined {
        const statement = this.database.prepare(sql)
        return params !== undefined ? statement.get(params) as T | undefined : statement.get() as T
    }

    public all<T>(sql: string, params?: any): T[] {
        const statement = this.database.prepare(sql)
        return params !== undefined ? statement.all(params) as T[] : statement.all() as T[]
    }

    public exec(sql: string): void {
        this.database.exec(sql)
    }

    public transaction<T>(callback: () => T): T {
        const transaction = this.database.transaction(callback)
        return transaction()
    }
}
