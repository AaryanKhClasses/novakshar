import { OperationContext } from '@novakshar/core'
import { DesktopBootstrap } from '@novakshar/desktop'
import { Assert } from '../helpers/Assert'
import { TemporaryWorkspace } from '../helpers/TemporaryWorkspace'
import { Scenario } from '../Scenario'

export class FolderLifecycleScenario implements Scenario {
    public readonly name = 'Folder Lifecycle'
    
    public async run(): Promise<void> {
        const workspace = new TemporaryWorkspace()
        await workspace.create()
        try {
            const bootstrap = new DesktopBootstrap()
            const session = await bootstrap.createWorkspace(workspace.path, "Integration Workspace")
            const context: OperationContext = { timestamp: new Date() }

            try {
                const folder = await session.folderService.create(context, "Stories", null)
                const created = await session.folderService.get(folder.id)
                Assert.isNotNull(created, "Folder was not created successfully.")
                Assert.areEqual("Stories", created?.name, "Folder name does not match after creation.")

                await session.folderService.rename(context, folder.id, "Novels")
                const renamed = await session.folderService.get(folder.id)
                Assert.isNotNull(renamed, "Folder was not found after renaming.")
                Assert.areEqual("Novels", renamed?.name, "Folder name does not match after renaming.")

                await session.folderService.delete(context, folder.id)
                const deleted = await session.folderService.get(folder.id)
                Assert.isTrue(deleted === null, "Folder was not deleted successfully.")
            } finally {
                await session.dispose()
            }
        } finally {
            await workspace.dispose()
        }
    }
}
