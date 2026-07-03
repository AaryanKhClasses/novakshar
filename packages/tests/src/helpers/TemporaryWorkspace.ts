import path from 'node:path'
import os from 'node:os'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'

export class TemporaryWorkspace {
    public readonly path: string

    constructor() {
        this.path = path.join(os.tmpdir(), `novakshar-${crypto.randomUUID()}`)
    }

    public async create(): Promise<void> {
        await fs.mkdir(this.path, { recursive: true })
    }

    public async dispose(): Promise<void> {
        let lastError: unknown;
        for(let i = 0; i < 10; i++) {
            try {
                await fs.rm(this.path, { recursive: true, force: true })
                return
            }
            catch(error) {
                lastError = error
                console.error(`Delete attempt ${i + 1} failed:`, error)
                await new Promise(resolve => setTimeout(resolve, 100))
            }
        }
        throw lastError
    }

    public async exists(relativePath: string): Promise<boolean> {
        try {
            await fs.access(path.join(this.path, relativePath))
            return true
        } catch { return false }
    }
}
