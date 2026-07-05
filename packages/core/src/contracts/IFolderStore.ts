import { Folder } from '../models/Folder.js'

export interface IFolderStore {
    get(id: string): Promise<Folder | null>
    getChildren(parentID: string | null): Promise<Folder[]>
    getRootFolders(): Promise<Folder[]>
    save(folder: Folder): Promise<void>
    delete(id: string): Promise<void>
}
