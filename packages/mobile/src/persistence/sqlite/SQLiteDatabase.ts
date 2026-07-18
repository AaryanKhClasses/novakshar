import { DB, openV2 } from '@op-engineering/op-sqlite'
import { SQLiteContext } from './SQLiteContext.js'

export class SQLiteDatabase {
    private readonly database: DB
    private readonly _context: SQLiteContext

    constructor(path: string) {
        this.database = openV2({ path })
        this._context = new SQLiteContext(this.database)
    }

    public get connection(): DB { return this.database }
    public get context(): SQLiteContext { return this._context }
    public close(): void { this.database.close() }
}
