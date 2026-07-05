import { SQLiteContext } from './SQLiteContext.js'
import { V1 } from './migrations/v1.js'

export class SQLiteMigrationRunner {
    constructor(private readonly context: SQLiteContext) { }

    public migrate(): void {
        this.context.exec(V1)
    }
}
