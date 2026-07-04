import { DesktopBootstrap, WorkspaceSession } from '@novakshar/desktop'
import { WorkspaceInfo } from '../shared/workspace'

export class ApplicationHost {
    private readonly bootstrap = new DesktopBootstrap()
    private session: WorkspaceSession | null = null

    public get currentSession(): WorkspaceSession | null { return this.session }

    public async createWorkspace(workspacePath: string, name: string): Promise<WorkspaceInfo> {
        await this.closeWorkspace()
        this.session = await this.bootstrap.createWorkspace(workspacePath, name)
        return {
            name: this.session.workspace.name,
            path: this.session.workspace.rootPath
        }
    }

    public async openWorkspace(workspacePath: string): Promise<WorkspaceInfo> {
        await this.closeWorkspace()
        this.session = await this.bootstrap.openWorkspace(workspacePath)
        return {
            name: this.session.workspace.name,
            path: this.session.workspace.rootPath
        }
    }

    public async closeWorkspace(): Promise<void> {
        if(!this.session) return
        await this.session.dispose()
        this.session = null
    }
}
