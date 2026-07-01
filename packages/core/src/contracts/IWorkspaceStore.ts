import { Workspace } from '../models/Workspace'

export interface IWorkspaceStore {
    get(): Promise<Workspace | null>
    save(Workspace: Workspace): Promise<void>
    delete(): Promise<void>
}
