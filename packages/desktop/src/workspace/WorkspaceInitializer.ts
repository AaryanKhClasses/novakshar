import { Constants, IFileSystem } from '@novakshar/core'
import * as path from 'node:path'

export class WorkspaceInitializer {
    constructor(private readonly fileSystem: IFileSystem) { }

    public async initialize(workspacePath: string): Promise<void> {
        const metadataPath = path.join(workspacePath, Constants.WorkspaceFolder)
        await this.fileSystem.createDirectory(workspacePath)
        await this.fileSystem.createDirectory(metadataPath)
        await this.fileSystem.createDirectory(path.join(metadataPath, Constants.NotesFolder))
        await this.fileSystem.createDirectory(path.join(metadataPath, Constants.AttachmentsFolder))

        await this.fileSystem.writeFile(path.join(metadataPath, Constants.SettingsFile), JSON.stringify({}))
        await this.fileSystem.writeFile(path.join(metadataPath, Constants.SyncFile), JSON.stringify({}))
        await this.fileSystem.writeFile(path.join(metadataPath, Constants.DatabaseFile), JSON.stringify({}))
        await this.fileSystem.writeFile(path.join(metadataPath, Constants.WorkspaceFile), JSON.stringify({
            version: 1
        }, null, 4))
    }
}
