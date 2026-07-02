import { Constants, IFileSystem, IWorkspaceStore, Workspace } from '@novakshar/core'
import path from 'node:path'

interface WorkspaceDTO {
    id: string
    name: string
    rootPath: string
    version: number
    createdAt: string
    updatedAt: string
}

export class WorkspaceFileStore implements IWorkspaceStore {
    constructor(
        private readonly fileSystem: IFileSystem,
        private readonly workspacePath: string
    ) { }

    private get filePath(): string {
        return path.join(this.workspacePath, Constants.WorkspaceFolder, Constants.WorkspaceFile)
    }

    public async exists(): Promise<boolean> {
        return this.fileSystem.exists(this.filePath)
    }

    public async get(): Promise<Workspace | null> {
        if(!(await this.exists())) return null
        const json = await this.fileSystem.readFile(this.filePath)
        const dto = JSON.parse(json) as Workspace

        return new Workspace({
            id: dto.id,
            name: dto.name,
            rootPath: dto.rootPath,
            version: dto.version,
            createdAt: new Date(dto.createdAt),
            updatedAt: new Date(dto.updatedAt)
        })
    }

    public async save(workspace: Workspace): Promise<void> {
        const dto: WorkspaceDTO = {
            id: workspace.id,
            name: workspace.name,
            rootPath: workspace.rootPath,
            version: workspace.version,
            createdAt: workspace.createdAt.toISOString(),
            updatedAt: workspace.updatedAt.toISOString()
        }
        await this.fileSystem.writeFile(this.filePath, JSON.stringify(dto, null, 4))
    }

    public async delete(): Promise<void> {
        await this.fileSystem.deleteFile(this.filePath)
    }
}
