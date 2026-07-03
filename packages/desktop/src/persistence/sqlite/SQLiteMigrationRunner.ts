import { SQLiteContext } from './SQLiteContext'
import { V1 } from './migrations/v1'

export class SQLiteMigrationRunner {
    constructor(private readonly context: SQLiteContext) { }

    public migrate(): void {
        this.context.exec(V1)
    }
}
