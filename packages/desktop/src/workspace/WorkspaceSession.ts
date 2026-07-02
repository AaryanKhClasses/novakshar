import { DocumentService, FolderService, WorkspaceManager } from '@novakshar/core'

export class WorkspaceSession {
    constructor(
        public readonly workspaceManager: WorkspaceManager,
        public readonly documentService: DocumentService,
        public readonly folderService: FolderService,
        private readonly onDispose?: () => Promise<void> | void
    ) { }

    public async dispose(): Promise<void> {
        if(this.onDispose) await this.onDispose()
    }
}
