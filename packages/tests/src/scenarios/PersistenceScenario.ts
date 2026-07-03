import { OperationContext } from '@novakshar/core'
import { DesktopBootstrap } from '@novakshar/desktop'
import { Assert } from '../helpers/Assert'
import { TemporaryWorkspace } from '../helpers/TemporaryWorkspace'
import { Scenario } from '../Scenario'

export class PersistenceScenario implements Scenario {
    public readonly name = "Persistence"

    public async run(): Promise<void> {
        const workspace = new TemporaryWorkspace()
        await workspace.create()
        try {
            const bootstrap = new DesktopBootstrap()
            const session1 = await bootstrap.createWorkspace(workspace.path, "Integration Workspace")
            const context: OperationContext = { timestamp: new Date() }

            try {
                const folder = await session1.folderService.create(context, "Stories", null)
                const chapter1 = await session1.documentService.create(context, "Chapter 1", "Stories/Chapter 1.md", folder.id)
                const chapter2 = await session1.documentService.create(context, "Chapter 2", "Stories/Chapter 2.md", folder.id)

                Assert.isTrue(await workspace.exists("Notes/Stories/Chapter 1.md"), "Chapter 1 file does not exist after creation.")
                Assert.isTrue(await workspace.exists("Notes/Stories/Chapter 2.md"), "Chapter 2 file does not exist after creation.")

                var folderID = folder.id
                var chapter1ID = chapter1.id
                var chapter2ID = chapter2.id
            } finally {
                await session1.dispose()
            }

            const session2 = await bootstrap.openWorkspace(workspace.path)
            try {
                const reopenedFolder = await session2.folderService.get(folderID)
                Assert.isNotNull(reopenedFolder, "Folder was not found after reopening the workspace.")
                Assert.areEqual("Stories", reopenedFolder?.name, "Folder name does not match after reopening the workspace.")

                const reopenedChapter1 = await session2.documentService.get(chapter1ID)
                Assert.isNotNull(reopenedChapter1, "Chapter 1 was not found after reopening the workspace.")
                Assert.areEqual("Chapter 1", reopenedChapter1?.title, "Chapter 1 title does not match after reopening the workspace.")

                const reopenedChapter2 = await session2.documentService.get(chapter2ID)
                Assert.isNotNull(reopenedChapter2, "Chapter 2 was not found after reopening the workspace.")
                Assert.areEqual("Chapter 2", reopenedChapter2?.title, "Chapter 2 title does not match after reopening the workspace.")

                Assert.isTrue(await workspace.exists("Notes/Stories/Chapter 1.md"), "Chapter 1 file does not exist after reopening the workspace.")
                Assert.isTrue(await workspace.exists("Notes/Stories/Chapter 2.md"), "Chapter 2 file does not exist after reopening the workspace.")
            } finally {
                await session2.dispose()
            }
        } finally {
            await workspace.dispose()
        }
    }
}
