import { Constants, DocumentService, Folder, FolderService, IClock, IEventBus, IFileSystem, IIDGenerator, WorkspaceManager } from '@novakshar/core'
import { MobileDocumentFileStore, MobileFolderFileStore, FolderPathResolver, SQLiteAttachmentStore, SQLiteDatabase, SQLiteDocumentStore, SQLiteFolderStore, SQLiteMigrationRunner, WorkspaceFileStore, WorkspaceSession, WorkspaceValidator } from '../index.js'

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

        const database = new SQLiteDatabase(`${workspacePath}/${Constants.WorkspaceFolder}`, Constants.DatabaseFile)
        const migrationRunner = new SQLiteMigrationRunner(database.context)
        migrationRunner.migrate()

        const workspaceStore = new WorkspaceFileStore(this.fileSystem, workspacePath)
        const folderStore = new SQLiteFolderStore(database.context)
        const folderPathResolver = new FolderPathResolver(await folderStore.getAll().then(folders => {
            const map = new Map<string, Folder>()
            for(const folder of folders) map.set(folder.id, folder)
            return map
        }))
        const documentStore = new SQLiteDocumentStore(database.context)
        const documentFileStore = new MobileDocumentFileStore(this.fileSystem, workspacePath)
        const folderFileStore = new MobileFolderFileStore(this.fileSystem, workspacePath, folderPathResolver, folderStore, documentStore)
        const attachmentStore = new SQLiteAttachmentStore(database.context)

        const workspaceManager = new WorkspaceManager(workspaceStore, this.eventBus, this.clock, this.idGenerator)
        const documentService = new DocumentService(documentStore, documentFileStore, folderStore, this.eventBus, this.clock, this.idGenerator)
        const folderService = new FolderService(folderStore, folderFileStore, this.eventBus, this.clock, this.idGenerator)

        const workspace = await workspaceManager.get()
        if(!workspace) throw new Error('Workspace not found')

        return new WorkspaceSession(workspace, workspaceManager, documentService, folderService, folderPathResolver, this.fileSystem, async() => database.close())
    }
}
