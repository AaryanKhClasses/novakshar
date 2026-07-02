import { Folder } from '../models/Folder'

export interface IFolderStore {
    get(id: string): Promise<Folder | null>
    save(folder: Folder): Promise<void>
    delete(id: string): Promise<void>
}
