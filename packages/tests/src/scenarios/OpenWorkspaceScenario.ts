import { DesktopBootstrap } from '@novakshar/desktop'
import { TemporaryWorkspace } from '../helpers/TemporaryWorkspace'
import { Scenario } from '../Scenario'
import { Assert } from '../helpers/Assert'

export class OpenWorkspaceScenario implements Scenario {
    public readonly name = "Open Workspace"

    public async run(): Promise<void> {
        const workspace = new TemporaryWorkspace()
        await workspace.create()
        try {
            const bootstrap = new DesktopBootstrap()
            const createdSession = await bootstrap.createWorkspace(workspace.path, "Integration Workspace")
            await createdSession.dispose()
            const reopenedSession = await bootstrap.openWorkspace(workspace.path)
            const reopenedWorkspace = await reopenedSession.workspaceManager.get()

            Assert.areEqual("Integration Workspace", reopenedWorkspace?.name, "Workspace Name Was Not Preserved After Reopening.")
            Assert.areEqual(workspace.path, reopenedWorkspace?.rootPath, "Workspace Path Was Not Preserved After Reopening.")
            await reopenedSession.dispose()
        } finally {
            await workspace.dispose()
        }
    }
}
