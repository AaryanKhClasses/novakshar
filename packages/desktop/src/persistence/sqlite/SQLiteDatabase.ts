import Database from 'better-sqlite3'
import { SQLiteContext } from './SQLiteContext.js'

export class SQLiteDatabase {
    private readonly database: Database.Database
    private readonly _context: SQLiteContext

    constructor(path: string) {
        this.database = new Database(path)
        this.database.pragma("foreign_keys = ON")
        this.database.pragma("journal_mode = WAL")
        this.database.pragma("synchronous = NORMAL")
        this._context = new SQLiteContext(this.database)
    }

    public get connection(): Database.Database { return this.database }
    public get context(): SQLiteContext { return this._context }
    public close(): void { this.database.close() }
}
