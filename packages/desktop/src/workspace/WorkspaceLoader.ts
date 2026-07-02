import path from 'node:path'
import { DesktopFileSystem } from '../filesystem'
import { WorkspaceFileStore, WorkspaceSession, WorkspaceValidator } from '.'
import { SQLiteAttachmentStore, SQLiteDatabase, SQLiteDocumentStore, SQLiteFolderStore, SQLiteMigrationRunner } from '../persistence'
import { Constants, DocumentService, EventBus, FolderService, SystemClock, UlidGenerator, WorkspaceManager } from '@novakshar/core'

export class WorkspaceLoader {
    public async load(workspacePath: string): Promise<WorkspaceSession> {
        const fileSystem = new DesktopFileSystem()
        const validator = new WorkspaceValidator(fileSystem)
        const validation = await validator.validate(workspacePath)
        if(!validation.valid) throw new Error(validation.reason)

        const database = new SQLiteDatabase(path.join(workspacePath, Constants.WorkspaceFolder, Constants.DatabaseFile))
        const migrationRunner = new SQLiteMigrationRunner(database.context)
        migrationRunner.migrate()

        const workspaceStore = new WorkspaceFileStore(fileSystem, workspacePath)
        const folderStore = new SQLiteFolderStore(database.context)
        const documentStore = new SQLiteDocumentStore(database.context)
        const attachmentStore = new SQLiteAttachmentStore(database.context)

        const eventBus = new EventBus()
        const clock = new SystemClock()
        const idGenerator = new UlidGenerator()
        
        const workspaceManager = new WorkspaceManager(workspaceStore, eventBus, clock, idGenerator)
        const documentService = new DocumentService(documentStore, folderStore, fileSystem, eventBus, clock, idGenerator)
        const folderService = new FolderService(folderStore, eventBus, clock, idGenerator)

        return new WorkspaceSession(workspaceManager, documentService, folderService, async() => database.close())
    }
}
