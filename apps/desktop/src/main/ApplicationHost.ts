import { DesktopBootstrap, WorkspaceSession } from '@novakshar/desktop'

export class ApplicationHost {
    private readonly bootstrap = new DesktopBootstrap()
    private session: WorkspaceSession | null = null

    public get currentSession(): WorkspaceSession | null { return this.session }

    public async createWorkspace(workspacePath: string, name: string): Promise<void> {
        await this.closeWorkspace()
        this.session = await this.bootstrap.createWorkspace(workspacePath, name)
    }

    public async openWorkspace(workspacePath: string): Promise<void> {
        await this.closeWorkspace()
        this.session = await this.bootstrap.openWorkspace(workspacePath)
    }

    public async closeWorkspace(): Promise<void> {
        if(!this.session) return
        await this.session.dispose()
        this.session = null
    }
}
