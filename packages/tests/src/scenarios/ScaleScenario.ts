import { OperationContext } from '@novakshar/core'
import { DesktopBootstrap } from '@novakshar/desktop'
import { Assert } from '../helpers/Assert'
import { TemporaryWorkspace } from '../helpers/TemporaryWorkspace'
import { Scenario } from '../Scenario'

export class ScaleScenario implements Scenario {
    public readonly name = 'Scale'

    public async run(): Promise<void> {
        const workspace = new TemporaryWorkspace()
        await workspace.create()
        try {
            const bootstrap = new DesktopBootstrap()
            const session1 = await bootstrap.createWorkspace(workspace.path, "Scale Workspace")
            const context: OperationContext = { timestamp: new Date() }
            const folders: string[] = []
            const documents: string[] = []

            try {
                for(let i = 0; i < 100; i++) {
                    const folder = await session1.folderService.create(context, `Folder ${i + 1}`, null)
                    folders.push(folder.id)
                }
                for(let i = 0; i < 1000; i++) {
                    const folderIndex = i % folders.length
                    const folderID = folders[folderIndex]
                    const document = await session1.documentService.create(context, `Document ${i + 1}`, `Folder ${folderIndex + 1}/Document ${i + 1}.md`, folderID!)
                    documents.push(document.id)
                }
                for(let i = 0; i < documents.length; i += 10) {
                    const folderIndex = i % folders.length
                    await session1.documentService.rename(context, documents[i]!, `Document ${i + 1} Renamed`, `Folder ${folderIndex + 1}/Document ${i + 1} Renamed.md`)
                }
                for(let i = 0; i < documents.length; i += 20) {
                    await session1.documentService.move(context, documents[i]!, null, `Document ${i + 1} Moved.md`)
                }
            } finally {
                await session1.dispose()
            }

            const session2 = await bootstrap.openWorkspace(workspace.path)
            try {
                for(const folderID of folders) {
                    const folder = await session2.folderService.get(folderID)
                    Assert.isNotNull(folder, `Folder with ID ${folderID} was not found after reopening the workspace.`)
                }

                for(const documentID of documents) {
                    const document = await session2.documentService.get(documentID)
                    Assert.isNotNull(document, `Document with ID ${documentID} was not found after reopening the workspace.`)
                    Assert.isTrue(await workspace.exists(`Notes/${document!.relativePath}`), `Document file ${document!.relativePath} does not exist after reopening the workspace.`)
                }
            } finally {
                await session2.dispose()
            }
        } finally {
            await workspace.dispose()
        }
    }
}
