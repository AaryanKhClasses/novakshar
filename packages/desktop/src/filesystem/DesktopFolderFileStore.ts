import { Constants, Folder, IDocumentStore, IFileSystem, IFolderFileStore, IFolderStore } from '@novakshar/core'
import path from 'node:path'
import { FolderPathResolver } from './FolderPathResolver.js'

export class DesktopFolderFileStore implements IFolderFileStore {
    constructor(
        private readonly fileSystem: IFileSystem,
        private readonly workspaceRoot: string,
        private readonly resolver: FolderPathResolver,
        private readonly folderStore: IFolderStore,
        private readonly documentStore: IDocumentStore
    ) { }

    public async create(folder: Folder): Promise<void> {
        const relative = this.resolver.resolve(folder)
        await this.fileSystem.createDirectory(path.join(this.workspaceRoot, Constants.NotesFolder, relative))
        this.resolver.add(folder)
    }

    public async update(prev: Folder, current: Folder): Promise<void> {
        const oldRelative = this.resolver.resolve(prev)
        const newRelative = this.resolver.resolve(current)
        if(oldRelative === newRelative) return

        const folders = await this.folderStore.getAll()
        const folderMap = new Map(folders.map(folder => [folder.id, folder]))
        const descendantFolderIDs = this.collectDescendantFolderIDs(folders, current.id)

        await this.fileSystem.move(
            path.join(this.workspaceRoot, Constants.NotesFolder, oldRelative),
            path.join(this.workspaceRoot, Constants.NotesFolder, newRelative)
        )

        this.resolver.update(current)
        folderMap.set(current.id, current)

        const documents = await this.documentStore.getAll()
        for(const document of documents) {
            if(!document.folderID || !descendantFolderIDs.has(document.folderID)) continue
            const folder = folderMap.get(document.folderID)
            if(!folder) continue
            const updatedRelativePath = path.join(this.resolver.resolve(folder), path.basename(document.relativePath))
            document.moveToPath(updatedRelativePath, current.updatedAt)
            await this.documentStore.save(document)
        }
    }

    public async delete(folder: Folder): Promise<void> {
        const relative = this.resolver.resolve(folder)
        await this.fileSystem.deleteDirectory(path.join(this.workspaceRoot, Constants.NotesFolder, relative))
        this.resolver.remove(folder.id)
    }

    private collectDescendantFolderIDs(folders: Folder[], rootFolderID: string): Set<string> {
        const descendantFolderIDs = new Set<string>([rootFolderID])
        let changed = true

        while(changed) {
            changed = false
            for(const folder of folders) {
                if(!folder.parentID || !descendantFolderIDs.has(folder.parentID) || descendantFolderIDs.has(folder.id)) continue
                descendantFolderIDs.add(folder.id)
                changed = true
            }
        }

        return descendantFolderIDs
    }
}
