import { Folder } from '../models/index.js'

export interface IFolderFileStore {
    create(folder: Folder): Promise<void>
    update(prev: Folder, current: Folder): Promise<void>
    delete(folder: Folder): Promise<void>
}
