import { OperationContext } from '@novakshar/core'
import { DesktopBootstrap } from '@novakshar/desktop'
import { Assert } from '../helpers/Assert'
import { TemporaryWorkspace } from '../helpers/TemporaryWorkspace'
import { Scenario } from '../Scenario'

export class DocumentLifecycleScenario implements Scenario {
    public readonly name = "Document Lifecycle"

    public async run(): Promise<void> {
        const workspace = new TemporaryWorkspace()
        await workspace.create()
        try {
            const bootstrap = new DesktopBootstrap()
            const session = await bootstrap.createWorkspace(workspace.path, "Integration Workspace")
            const context: OperationContext = { timestamp: new Date() }

            try {
                const folder = await session.folderService.create(context, "Stories", null)
                const document = await session.documentService.create(context, "Chapter 1", "Stories/Chapter 1.md", folder.id)
                const created = await session.documentService.get(document.id)
                Assert.isNotNull(created, "Document was not created successfully.")
                Assert.areEqual("Chapter 1", created?.title, "Document title does not match after creation.")
                Assert.areEqual(folder.id, created?.folderID, "Document folder ID does not match after creation.")
                Assert.isTrue(await workspace.exists("Notes/Stories/Chapter 1.md"), "Document file does not exist after creation.")

                await session.documentService.rename(context, document.id, "Chapter 1 - Revised", "Stories/Chapter 1 - Revised.md")
                const renamed = await session.documentService.get(document.id)
                Assert.isNotNull(renamed, "Document was not found after renaming.")
                Assert.areEqual("Chapter 1 - Revised", renamed?.title, "Document title does not match after renaming.")
                Assert.areEqual(folder.id, renamed?.folderID, "Document folder ID does not match after renaming.")
                Assert.isTrue(await workspace.exists("Notes/Stories/Chapter 1 - Revised.md"), "Document file does not exist after renaming.")

                await session.documentService.move(context, document.id, null, "Chapter 1 - Revised.md")
                const moved = await session.documentService.get(document.id)
                Assert.isNotNull(moved, "Document was not found after moving.")
                Assert.areEqual("Chapter 1 - Revised", moved?.title, "Document title does not match after moving.")
                Assert.isTrue(await workspace.exists("Notes/Chapter 1 - Revised.md"), "Document file does not exist after moving.")

                await session.documentService.delete(context, document.id)
                const deleted = await session.documentService.get(document.id)
                Assert.isNotNull(deleted, "Document was not found after deletion.")
                Assert.isTrue(deleted?.deleted === true, "Document was not marked as deleted after deletion.")

                await session.documentService.restore(context, document.id)
                const restored = await session.documentService.get(document.id)
                Assert.isNotNull(restored, "Document was not found after restoration.")
                Assert.isTrue(restored?.deleted === false, "Document was not marked as restored after restoration.")
            } finally {
                await session.dispose()
            }
        } finally {
            await workspace.dispose()
        }
    }
}
