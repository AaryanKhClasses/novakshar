import { Folder } from '../models/index.js'

export interface IFolderFileStore {
    create(folder: Folder): Promise<void>
    rename(folder: Folder): Promise<void>
    delete(folder: Folder): Promise<void>
}
