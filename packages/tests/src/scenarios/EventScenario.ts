import { DocumentCreatedEvent, DocumentDeletedEvent, DocumentFavoritedEvent, DocumentMovedEvent, DocumentRenamedEvent, DocumentRestoredEvent, DocumentUnfavoritedEvent, FolderCreatedEvent, FolderDeletedEvent, FolderRenamedEvent, OperationContext } from '@novakshar/core'
import { DesktopBootstrap } from '@novakshar/desktop'
import { Assert } from '../helpers/Assert'
import { TemporaryWorkspace } from '../helpers/TemporaryWorkspace'
import { TestEventBus } from '../helpers/TestEventBus'
import { Scenario } from '../Scenario'

export class EventScenario implements Scenario {
    public readonly name = 'Event Verification'

    public async run(): Promise<void> {
        const workspace = new TemporaryWorkspace()
        await workspace.create()
        const eventBus = new TestEventBus()
        try {
            const bootstrap = new DesktopBootstrap(undefined, undefined, undefined, eventBus)
            const session = await bootstrap.createWorkspace(workspace.path, "Integration Workspace")
            const context: OperationContext = { timestamp: new Date() }
            try {
                const folder = await session.folderService.create(context, "Stories", null)
                await session.folderService.rename(context, folder.id, "Tales")
                
                const document = await session.documentService.create(context, "Chapter 1", "Tales/Chapter 1.md", folder.id)
                await session.documentService.rename(context, document.id, "Chapter One", "Tales/Chapter One.md")
                await session.documentService.move(context, document.id, null, "Tales/Chapter One.md")
                await session.documentService.favorite(context, document.id)
                await session.documentService.unfavorite(context, document.id)
                await session.documentService.delete(context, document.id)
                await session.documentService.restore(context, document.id)

                await session.folderService.delete(context, folder.id)

                const events = eventBus.events
                Assert.areEqual(10, events.length, "Unexpected number of events published.")
                Assert.isTrue(events[0] instanceof FolderCreatedEvent, "First event is not a FolderCreatedEvent.")
                Assert.isTrue(events[1] instanceof FolderRenamedEvent, "Second event is not a FolderRenamedEvent.")
                Assert.isTrue(events[2] instanceof DocumentCreatedEvent, "Third event is not a DocumentCreatedEvent.")
                Assert.isTrue(events[3] instanceof DocumentRenamedEvent, "Fourth event is not a DocumentRenamedEvent.")
                Assert.isTrue(events[4] instanceof DocumentMovedEvent, "Fifth event is not a DocumentMovedEvent.")
                Assert.isTrue(events[5] instanceof DocumentFavoritedEvent, "Sixth event is not a DocumentFavoritedEvent.")
                Assert.isTrue(events[6] instanceof DocumentUnfavoritedEvent, "Seventh event is not a DocumentUnfavoritedEvent.")
                Assert.isTrue(events[7] instanceof DocumentDeletedEvent, "Eighth event is not a DocumentDeletedEvent.")
                Assert.isTrue(events[8] instanceof DocumentRestoredEvent, "Ninth event is not a DocumentRestoredEvent.")
                Assert.isTrue(events[9] instanceof FolderDeletedEvent, "Tenth event is not a FolderDeletedEvent.")
            } finally {
                await session.dispose()
            }
        } finally {
            await workspace.dispose()
        }
    }
}
