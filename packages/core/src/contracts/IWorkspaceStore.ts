import { Workspace } from '../models/Workspace'

export interface IWorkspaceStore {
    exists(): Promise<boolean>
    get(): Promise<Workspace | null>
    save(workspace: Workspace): Promise<void>
    delete(): Promise<void>
}
