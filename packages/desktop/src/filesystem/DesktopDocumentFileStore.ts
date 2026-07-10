import { Constants, IDocumentFileStore, IFileSystem } from '@novakshar/core'
import * as path from 'node:path'

export class DesktopDocumentFileStore implements IDocumentFileStore {
    constructor(
        private readonly fileSystem: IFileSystem,
        private readonly workspacePath: string
    ) { }

    private resolve(relativePath: string): string {
        return path.join(this.workspacePath, Constants.NotesFolder, relativePath)
    }
    
    public async create(relativePath: string, title: string): Promise<void> {
        const absolutePath = this.resolve(relativePath)
        await this.fileSystem.createDirectory(path.dirname(absolutePath))
        await this.fileSystem.writeFile(absolutePath, `${title}\n`)
    }
    
    public async move(oldRelativePath: string, newRelativePath: string): Promise<void> {
        const destination = this.resolve(newRelativePath)
        await this.fileSystem.createDirectory(path.dirname(destination))
        await this.fileSystem.move(this.resolve(oldRelativePath), destination)
    }
    
    public async delete(relativePath: string): Promise<void> {
        await this.fileSystem.deleteFile(this.resolve(relativePath))
    }
    
    public async exists(relativePath: string): Promise<boolean> {
        return this.fileSystem.exists(this.resolve(relativePath))
    }
    
    public async read(relativePath: string): Promise<string> {
        return this.fileSystem.readFile(this.resolve(relativePath))
    }
    
    public async write(relativePath: string, content: string): Promise<void> {
        await this.fileSystem.writeFile(this.resolve(relativePath), content)
    }
}
