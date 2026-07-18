import { Constants, IClock, IFileSystem, IIDGenerator, Workspace } from '@novakshar/core'
import { WorkspaceFileStore } from './WorkspaceFileStore.js'

export class WorkspaceInitializer {
    constructor(
        private readonly fileSystem: IFileSystem,
        private readonly idGenerator: IIDGenerator,
        private readonly clock: IClock
    ) { }

    public async initialize(workspacePath: string, name: string): Promise<Workspace> {
        const now = this.clock.now()
        const workspace = new Workspace({
            id: this.idGenerator.generate(),
            name,
            rootPath: workspacePath,
            version: 1,
            createdAt: now,
            updatedAt: now
        })

        const metadataPath = `${workspacePath}/${Constants.WorkspaceFolder}`
        await this.fileSystem.createDirectory(workspacePath)
        await this.fileSystem.createDirectory(metadataPath)
        await this.fileSystem.createDirectory(`${workspacePath}/${Constants.NotesFolder}`)
        await this.fileSystem.createDirectory(`${workspacePath}/${Constants.AttachmentsFolder}`)

        await this.fileSystem.writeFile(`${metadataPath}/${Constants.SettingsFile}`, JSON.stringify({}))
        await this.fileSystem.writeFile(`${metadataPath}/${Constants.SyncFile}`, JSON.stringify({}))

        const workspaceStore = new WorkspaceFileStore(this.fileSystem, workspacePath)
        await workspaceStore.save(workspace)
        return workspace
    }
}
