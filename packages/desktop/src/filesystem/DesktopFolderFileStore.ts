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

    public async update(prev: Folder, current: Folder): Promise<void> {
        const oldRelative = this.resolver.resolve(prev)
        const newRelative = this.resolver.resolve(current)
        if(oldRelative === newRelative) return
        await this.fileSystem.move(
            path.join(this.workspaceRoot, Constants.NotesFolder, oldRelative),
            path.join(this.workspaceRoot, Constants.NotesFolder, newRelative)
        )
    }

    public async delete(folder: Folder): Promise<void> {
        const relative = this.resolver.resolve(folder)
        await this.fileSystem.deleteDirectory(path.join(this.workspaceRoot, Constants.NotesFolder, relative))
    }
}
