import { Constants, Folder, IFileSystem, IFolderFileStore } from '@novakshar/core'
import path from 'node:path'
import { FolderPathResolver } from './FolderPathResolver.js'

export class DesktopFolderFileStore implements IFolderFileStore {
    constructor(
        private readonly fileSystem: IFileSystem,
        private readonly workspaceRoot: string,
        private readonly resolver: FolderPathResolver
    ) { }

    public async create(folder: Folder): Promise<void> {
        const relative = this.resolver.resolve(folder)
        await this.fileSystem.createDirectory(path.join(this.workspaceRoot, Constants.NotesFolder, relative))
    }

    public async rename(folder: Folder): Promise<void> {
        throw new Error('Method not implemented.')
    }

    public async delete(folder: Folder): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
