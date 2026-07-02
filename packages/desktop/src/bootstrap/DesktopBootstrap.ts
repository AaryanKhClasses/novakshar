import { WorkspaceLoader } from '../workspace'

export class DesktopBootstrap {
    private readonly workspaceLoader = new WorkspaceLoader()

    public async openWorkspace(workspacePath: string) {
        return this.workspaceLoader.load(workspacePath)
    }
}
