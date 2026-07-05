import { EventBus, IClock, IEventBus, IFileSystem, IIDGenerator, SystemClock, UlidGenerator } from '@novakshar/core'
import { DesktopFileSystem, WorkspaceInitializer, WorkspaceLoader, WorkspaceSession } from '../index.js'

export class DesktopBootstrap {
    private readonly workspaceInitializer: WorkspaceInitializer
    private readonly workspaceLoader: WorkspaceLoader

    constructor(
        private readonly fileSystem: IFileSystem = new DesktopFileSystem(),
        private readonly clock: IClock = new SystemClock(),
        private readonly idGenerator: IIDGenerator = new UlidGenerator(),
        private readonly eventBus: IEventBus = new EventBus()
    ) {
        this.workspaceInitializer = new WorkspaceInitializer(this.fileSystem, this.idGenerator, this.clock)
        this.workspaceLoader = new WorkspaceLoader(this.fileSystem, this.idGenerator, this.clock, this.eventBus)
    }

    public async openWorkspace(workspacePath: string): Promise<WorkspaceSession> {
        return this.workspaceLoader.load(workspacePath)
    }

    public async createWorkspace(workspacePath: string, name: string): Promise<WorkspaceSession> {
        await this.workspaceInitializer.initialize(workspacePath, name)
        return this.workspaceLoader.load(workspacePath)
    }
}
