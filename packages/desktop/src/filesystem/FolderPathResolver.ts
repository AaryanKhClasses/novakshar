import { Folder } from '@novakshar/core'
import path from 'node:path'

export class FolderPathResolver {
    constructor(
        private readonly folders: Map<string, Folder>
    ) { }

    public resolve(folder: Folder): string {
        const parts: string[] = []
        let current: Folder | undefined = folder
        while(current) {
            parts.unshift(current.name)
            if(!current.parentID) break
            current = this.folders.get(current.parentID)
        }
        return path.join(...parts)
    }
}
