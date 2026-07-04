import { Constants, DocumentService, FolderService, IClock, IEventBus, IFileSystem, IIDGenerator, WorkspaceManager } from '@novakshar/core'
import path from 'node:path'
import { WorkspaceFileStore, WorkspaceSession, WorkspaceValidator } from '.'
import { DesktopDocumentFileStore } from '../filesystem'
import { SQLiteAttachmentStore, SQLiteDatabase, SQLiteDocumentStore, SQLiteFolderStore, SQLiteMigrationRunner } from '../persistence'

export class WorkspaceLoader {
    constructor(
        private readonly fileSystem: IFileSystem,
        private readonly idGenerator: IIDGenerator,
        private readonly clock: IClock,
        private readonly eventBus: IEventBus
    ) { }

    public async load(workspacePath: string): Promise<WorkspaceSession> {
        const validator = new WorkspaceValidator(this.fileSystem)
        const validation = await validator.validate(workspacePath)
        if(!validation.valid) throw new Error(validation.reason)

        const database = new SQLiteDatabase(path.join(workspacePath, Constants.WorkspaceFolder, Constants.DatabaseFile))
        const migrationRunner = new SQLiteMigrationRunner(database.context)
        migrationRunner.migrate()

        const workspaceStore = new WorkspaceFileStore(this.fileSystem, workspacePath)
        const folderStore = new SQLiteFolderStore(database.context)
        const documentStore = new SQLiteDocumentStore(database.context)
        const documentFileStore = new DesktopDocumentFileStore(this.fileSystem, workspacePath)
        const attachmentStore = new SQLiteAttachmentStore(database.context)

        const workspaceManager = new WorkspaceManager(workspaceStore, this.eventBus, this.clock, this.idGenerator)
        const documentService = new DocumentService(documentStore, documentFileStore, folderStore, this.eventBus, this.clock, this.idGenerator)
        const folderService = new FolderService(folderStore, this.eventBus, this.clock, this.idGenerator)

        const workspace = await workspaceManager.get()
        if(!workspace) throw new Error('Workspace not found')

        return new WorkspaceSession(workspace, workspaceManager, documentService, folderService, async() => database.close())
    }
}
