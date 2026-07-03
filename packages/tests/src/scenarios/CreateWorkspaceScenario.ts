import { Constants } from '@novakshar/core'
import { DesktopBootstrap } from '@novakshar/desktop'
import path from 'node:path'
import { Assert } from '../helpers/Assert'
import { TemporaryWorkspace } from '../helpers/TemporaryWorkspace'
import { Scenario } from '../Scenario'

export class CreateWorkspaceScenario implements Scenario {
    public readonly name = "Create Workspace"

    public async run(): Promise<void> {
        const workspace = new TemporaryWorkspace()
        await workspace.create()
        try {
            const bootstrap = new DesktopBootstrap()
            const session = await bootstrap.createWorkspace(workspace.path, "Integration Workspace")
            Assert.isTrue(await workspace.exists(Constants.WorkspaceFolder), "Workspace Folder Was Not Created.")
            Assert.isTrue(await workspace.exists(Constants.NotesFolder), "Notes Folder Was Not Created.")
            Assert.isTrue(await workspace.exists(Constants.AttachmentsFolder), "Attachments Folder Was Not Created.")
            Assert.isTrue(await workspace.exists(path.join(Constants.WorkspaceFolder, Constants.WorkspaceFile)), "Workspace File Was Not Created.")
            Assert.isTrue(await workspace.exists(path.join(Constants.WorkspaceFolder, Constants.SettingsFile)), "Settings File Was Not Created.")
            Assert.isTrue(await workspace.exists(path.join(Constants.WorkspaceFolder, Constants.SyncFile)), "Sync File Was Not Created.")
            // Assert.isTrue(await workspace.exists(path.join(Constants.WorkspaceFolder, Constants.DatabaseFile)), "Database File Was Not Created.")
            await session.dispose()
        } finally {
            await workspace.dispose()
        }
    }
}
