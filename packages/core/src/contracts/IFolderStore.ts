import { Folder } from '../models/Folder'

export interface IFolderStore {
    get(id: string): Promise<Folder | null>
    getAll(): Promise<Folder[]>
    create(folder: Folder): Promise<void>
    update(folder: Folder): Promise<void>
    delete(id: string): Promise<void>
}
