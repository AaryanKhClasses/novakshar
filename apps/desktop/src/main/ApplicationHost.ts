import { DesktopBootstrap, WorkspaceSession } from '@novakshar/desktop'
import { WorkspaceInfo } from '@shared/workspace'
import { NativeDialogService } from './services'
import { ApplicationStateStore } from './state'

export class ApplicationHost {
    private readonly bootstrap = new DesktopBootstrap()
    private session: WorkspaceSession | null = null

    constructor(
        private readonly dialog: NativeDialogService,
        private readonly state: ApplicationStateStore
    ) { }

    public get currentSession(): WorkspaceSession | null { return this.session }

    public async createWorkspace(): Promise<WorkspaceInfo | null> {
        const path = await this.dialog.chooseWorkspaceFolder()
        if(!path) return null
        const name = path.split(/[\\/]/).pop() ?? 'New Workspace'

        await this.closeWorkspace()
        this.session = await this.bootstrap.createWorkspace(path, name)
        await this.saveState(path)
        return { name, path }
    }

    public async openWorkspace(): Promise<WorkspaceInfo | null> {
        const path = await this.dialog.chooseExistingWorkspace()
        if(!path) return null
        return await this.openWorkspaceAt(path)
    }

    public async restoreWorkspace(): Promise<WorkspaceInfo | null> {
        const state = await this.state.load()
        if(!state.lastWorkspace) return null
        try {
            return await this.openWorkspaceAt(state.lastWorkspace)
        } catch {
            state.lastWorkspace = null
            await this.state.save(state)
            return null
        }
    }

    public async closeWorkspace(): Promise<void> {
        if(!this.session) return
        await this.session.dispose()
        this.session = null
    }

    private async openWorkspaceAt(path: string): Promise<WorkspaceInfo> {
        await this.closeWorkspace()
        this.session = await this.bootstrap.openWorkspace(path)
        await this.saveState(path)
        return {
            name: this.session.workspace.name,
            path
        }
    }

    private async saveState(path: string): Promise<void> {
        const state = await this.state.load()
        state.lastWorkspace = path
        await this.state.save(state)
    }
}
