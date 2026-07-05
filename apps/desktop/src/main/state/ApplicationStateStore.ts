import path from 'node:path'
import { promises as fs } from 'node:fs'
import { ApplicationState, DefaultApplicationState } from '.'
import { Constants } from '@novakshar/core'

export class ApplicationStateStore {
    constructor(private readonly root: string) { }

    private get file(): string { return path.join(this.root, Constants.AppName, 'application.json') }

    public async load(): Promise<ApplicationState> {
        try {
            const json = await fs.readFile(this.file, 'utf-8')
            return JSON.parse(json)
        } catch {
            await this.save(DefaultApplicationState)
            return DefaultApplicationState
        }
    }

    public async save(state: ApplicationState): Promise<void> {
        await fs.mkdir(path.join(this.root, Constants.AppName), { recursive: true })
        await fs.writeFile(this.file, JSON.stringify(state, null, 4))
    }
}
