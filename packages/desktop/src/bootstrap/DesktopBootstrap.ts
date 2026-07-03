import { EventBus, SystemClock, UlidGenerator } from '@novakshar/core'
import { DesktopFileSystem } from '..'
import { WorkspaceInitializer, WorkspaceLoader, WorkspaceSession } from '../workspace'

export class DesktopBootstrap {
    private readonly fileSystem = new DesktopFileSystem()
    private readonly clock = new SystemClock()
    private readonly idGenerator = new UlidGenerator()
    private readonly eventBus = new EventBus()

    private readonly workspaceInitializer = new WorkspaceInitializer(this.fileSystem, this.idGenerator, this.clock)
    private readonly workspaceLoader = new WorkspaceLoader(this.fileSystem, this.idGenerator, this.clock, this.eventBus)

    public async openWorkspace(workspacePath: string): Promise<WorkspaceSession> {
        return this.workspaceLoader.load(workspacePath)
    }

    public async createWorkspace(workspacePath: string, name: string): Promise<WorkspaceSession> {
        await this.workspaceInitializer.initialize(workspacePath, name)
        return this.workspaceLoader.load(workspacePath)
    }
}
