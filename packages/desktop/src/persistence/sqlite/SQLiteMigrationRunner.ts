import fs from 'node:fs'
import path from 'node:path'
import { SQLiteContext } from './SQLiteContext'

export class SQLiteMigrationRunner {
    constructor(private readonly context: SQLiteContext) { }

    public migrate(): void {
        const schemaDirectory = path.join(__dirname, 'schema')
        const migrations = fs.readdirSync(schemaDirectory).filter(file => file.endsWith('.sql')).sort()
        for(const migration of migrations) {
            const sql = fs.readFileSync(path.join(schemaDirectory, migration), 'utf8')
            this.context.exec(sql)
        }
    }
}
